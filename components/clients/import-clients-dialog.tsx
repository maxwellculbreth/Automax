'use client'

/**
 * ImportClientsDialog
 *
 * Multi-step import flow:
 *   method → input → mapping → review → done
 *
 * Currently wires to POST /api/clients (one at a time).
 * Future: POST /api/clients/import  (bulk, with GPT-assisted mapping).
 */

import React, { useRef, useState, useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Upload,
  ClipboardList,
  Sheet,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  SkipForward,
  GitMerge,
  FilePlus,
  Loader2,
  X,
  Sparkles,
  FileText,
  RotateCcw,
  Tag,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type ImportStep    = 'method' | 'input' | 'mapping' | 'review' | 'done'
type ImportMethod  = 'csv' | 'paste' | 'sheets'
type FieldKey      = 'name' | 'phone' | 'email' | 'address' | 'notes' | 'tags' | 'skip'
type DupStrategy   = 'skip' | 'merge' | 'new'

interface RawRow { [col: string]: string }

interface MappedRow {
  name:    string
  phone:   string
  email:   string
  address: string
  notes:   string
  tags:    string
  _raw:    RawRow
  _status: 'ready' | 'duplicate' | 'review'
  _dupName?: string  // name of existing client it conflicts with
}

interface ImportResult {
  imported: number
  skipped:  number
  failed:   number
}

interface ExistingClient {
  id:        string
  full_name: string
  email:     string | null
  phone:     string | null
}

interface Props {
  open:          boolean
  onOpenChange:  (open: boolean) => void
  onImported?:   () => void
  existingClients?: ExistingClient[]
}

// ── Field config ──────────────────────────────────────────────────────────────

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: 'name',    label: 'Name'    },
  { key: 'phone',   label: 'Phone'   },
  { key: 'email',   label: 'Email'   },
  { key: 'address', label: 'Address' },
  { key: 'notes',   label: 'Notes'   },
  { key: 'tags',    label: 'Tags'    },
  { key: 'skip',    label: 'Skip'    },
]

// Patterns used for auto-detection (order matters — first match wins)
const DETECT_PATTERNS: [FieldKey, RegExp][] = [
  ['name',    /\b(name|full.?name|client|customer|contact)\b/i],
  ['phone',   /\b(phone|mobile|cell|tel(ephone)?|ph\.?)\b/i],
  ['email',   /\b(e.?mail(\.?addr(ess)?)?|mail)\b/i],
  ['address', /\b(addr(ess)?|street|location)\b/i],
  ['notes',   /\b(note|comment|description|memo)\b/i],
  ['tags',    /\b(tag|label|categor|type)\b/i],
]

function autoDetect(header: string): FieldKey {
  const h = header.toLowerCase()
  for (const [field, re] of DETECT_PATTERNS) {
    if (re.test(h)) return field
  }
  return 'skip'
}

// ── CSV Parser ────────────────────────────────────────────────────────────────

function parseDelimited(raw: string): { headers: string[]; rows: RawRow[] } {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 1) return { headers: [], rows: [] }

  // Detect delimiter: tab or comma
  const sample    = lines[0]
  const delimiter = sample.includes('\t') ? '\t' : ','

  const splitLine = (line: string): string[] => {
    const cols: string[] = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
        else inQ = !inQ
      } else if (ch === delimiter && !inQ) {
        cols.push(cur.trim()); cur = ''
      } else {
        cur += ch
      }
    }
    cols.push(cur.trim())
    return cols
  }

  const headers = splitLine(lines[0]).map(h => h.replace(/^"|"$/g, ''))
  const rows: RawRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const vals = splitLine(lines[i])
    if (vals.every(v => !v)) continue  // skip blank rows
    const row: RawRow = {}
    headers.forEach((h, idx) => { row[h] = vals[idx] ?? '' })
    rows.push(row)
  }

  return { headers, rows }
}

// ── Duplicate detection ───────────────────────────────────────────────────────

function checkDuplicates(rows: MappedRow[], existing: ExistingClient[]): MappedRow[] {
  return rows.map(row => {
    const emailMatch = row.email && existing.find(c =>
      c.email && c.email.toLowerCase() === row.email.toLowerCase()
    )
    const phoneMatch = row.phone && existing.find(c =>
      c.phone && c.phone.replace(/\D/g, '') === row.phone.replace(/\D/g, '')
    )
    const dup = emailMatch || phoneMatch
    return dup
      ? { ...row, _status: 'duplicate' as const, _dupName: dup.full_name }
      : { ...row, _status: 'ready' as const, _dupName: undefined }
  })
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: ImportStep }) {
  const steps: { key: ImportStep; label: string }[] = [
    { key: 'method',  label: 'Method'  },
    { key: 'input',   label: 'Upload'  },
    { key: 'mapping', label: 'Map'     },
    { key: 'review',  label: 'Review'  },
    { key: 'done',    label: 'Done'    },
  ]
  const idx = steps.findIndex(s => s.key === current)
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={cn(
            'flex items-center gap-1.5',
            i > idx ? 'opacity-30' : ''
          )}>
            <div className={cn(
              'h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
              i < idx  ? 'bg-emerald-600 text-white' :
              i === idx ? 'bg-blue-600 text-white' :
                          'bg-muted text-muted-foreground'
            )}>
              {i < idx ? '✓' : i + 1}
            </div>
            <span className={cn(
              'text-[11px] font-medium hidden sm:inline',
              i === idx ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('flex-1 h-px max-w-[24px]', i < idx ? 'bg-emerald-600/40' : 'bg-border')} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ImportClientsDialog({ open, onOpenChange, onImported, existingClients = [] }: Props) {
  const [step,         setStep]         = useState<ImportStep>('method')
  const [method,       setMethod]       = useState<ImportMethod | null>(null)
  const [rawText,      setRawText]      = useState('')
  const [fileName,     setFileName]     = useState('')
  const [headers,      setHeaders]      = useState<string[]>([])
  const [rawRows,      setRawRows]      = useState<RawRow[]>([])
  const [mapping,      setMapping]      = useState<Record<string, FieldKey>>({})
  const [mappedRows,   setMappedRows]   = useState<MappedRow[]>([])
  const [dupStrategy,  setDupStrategy]  = useState<DupStrategy>('skip')
  const [isImporting,  setIsImporting]  = useState(false)
  const [result,       setResult]       = useState<ImportResult | null>(null)
  const [parseError,   setParseError]   = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Reset ──────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setStep('method'); setMethod(null); setRawText(''); setFileName('')
    setHeaders([]); setRawRows([]); setMapping({}); setMappedRows([])
    setDupStrategy('skip'); setIsImporting(false); setResult(null); setParseError('')
  }, [])

  // ── Parsing ────────────────────────────────────────────────────────────────

  const handleParse = useCallback((text: string) => {
    setParseError('')
    const { headers: h, rows } = parseDelimited(text)
    if (h.length === 0 || rows.length === 0) {
      setParseError('Could not detect any rows. Make sure the first line contains column headers.')
      return false
    }
    const auto: Record<string, FieldKey> = {}
    h.forEach(col => { auto[col] = autoDetect(col) })
    setHeaders(h)
    setRawRows(rows)
    setMapping(auto)
    return true
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      setRawText(text)
      if (handleParse(text)) setStep('mapping')
    }
    reader.readAsText(file)
  }, [handleParse])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      setRawText(text)
      if (handleParse(text)) setStep('mapping')
    }
    reader.readAsText(file)
  }, [handleParse])

  // ── Apply mapping → build MappedRows ──────────────────────────────────────

  const applyMapping = useCallback(() => {
    const pick = (row: RawRow, field: FieldKey) => {
      const col = Object.entries(mapping).find(([, f]) => f === field)?.[0]
      return col ? (row[col] ?? '') : ''
    }
    const rows: MappedRow[] = rawRows.map(row => ({
      name:    pick(row, 'name'),
      phone:   pick(row, 'phone'),
      email:   pick(row, 'email'),
      address: pick(row, 'address'),
      notes:   pick(row, 'notes'),
      tags:    pick(row, 'tags'),
      _raw:    row,
      _status: 'ready',
    }))
    const withDups = checkDuplicates(rows, existingClients)
    setMappedRows(withDups)
    setStep('review')
  }, [mapping, rawRows, existingClients])

  // ── Effective rows to import based on dup strategy ─────────────────────────

  const effectiveRows = useMemo(() => {
    return mappedRows.filter(row => {
      if (row._status === 'duplicate') {
        if (dupStrategy === 'skip') return false
        return true  // merge or new — include it
      }
      return true
    })
  }, [mappedRows, dupStrategy])

  const readyCount = mappedRows.filter(r => r._status === 'ready').length
  const dupCount   = mappedRows.filter(r => r._status === 'duplicate').length
  const reviewCount = mappedRows.filter(r => r._status === 'review').length

  // ── Import ─────────────────────────────────────────────────────────────────

  const handleImport = useCallback(async () => {
    setIsImporting(true)
    let imported = 0; let skipped = 0; let failed = 0

    for (const row of effectiveRows) {
      if (!row.name.trim()) { skipped++; continue }
      try {
        // TODO: replace loop with POST /api/clients/import (bulk endpoint)
        const res = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: row.name,
            phone:     row.phone     || null,
            email:     row.email     || null,
            address:   row.address   || null,
            notes:     row.notes     || null,
            tags:      row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            status:    'active',
            // For merge strategy, pass lead hint so backend can dedup
            _import_strategy: row._status === 'duplicate' ? dupStrategy : 'new',
          }),
        })
        if (res.ok) imported++
        else skipped++
      } catch {
        failed++
      }
    }

    setResult({ imported, skipped, failed })
    setIsImporting(false)
    setStep('done')
    if (imported > 0) onImported?.()
  }, [effectiveRows, dupStrategy, onImported])

  // ── Render helpers ─────────────────────────────────────────────────────────

  const sampleData = `Name,Phone,Email,Address,Notes\nJohn Smith,(555) 100-2000,john@email.com,123 Oak St,Regular customer\nJane Doe,(555) 200-3000,jane@email.com,456 Elm Ave,Referred by John`

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className={cn(
        'flex flex-col gap-0 p-0 overflow-hidden',
        step === 'review' ? 'sm:max-w-3xl max-h-[85vh]' : 'sm:max-w-xl'
      )}>
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[15px] font-bold">Import Clients</DialogTitle>
            {step !== 'method' && step !== 'done' && (
              <button
                onClick={reset}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Start over
              </button>
            )}
          </div>
          <StepIndicator current={step} />
        </DialogHeader>

        <div className={cn('overflow-y-auto flex-1', step === 'review' ? 'p-6' : 'px-6 py-5')}>

          {/* ── Step: Method ──────────────────────────────────────────────── */}
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-[13px] text-muted-foreground">
                Choose how you want to bring in your client list.
              </p>
              <div className="grid grid-cols-1 gap-3">

                {/* CSV Upload */}
                <button
                  onClick={() => { setMethod('csv'); setStep('input') }}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/[0.03]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Upload className="h-4.5 w-4.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground">Upload CSV file</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      Drag & drop or browse a .csv file. First row must be column headers.
                    </p>
                  </div>
                </button>

                {/* Paste rows */}
                <button
                  onClick={() => { setMethod('paste'); setStep('input') }}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/[0.03]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                    <ClipboardList className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground">Paste CSV / spreadsheet rows</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      Copy rows directly from Excel, Google Sheets, or any CSV. Paste here.
                    </p>
                  </div>
                </button>

                {/* Google Sheets — future */}
                <div className="group flex items-start gap-4 rounded-xl border border-border bg-card/50 p-4 opacity-50 cursor-not-allowed select-none">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Sheet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground">Connect Google Sheets</span>
                      <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Soon
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      Paste a sheet URL and we&apos;ll sync rows automatically.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── Step: Input ───────────────────────────────────────────────── */}
          {step === 'input' && method === 'csv' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep('method')} className="text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="text-[13px] text-muted-foreground">
                  Drop your CSV file below. First row must contain column headers.
                </p>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleFileDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 py-12 px-6 text-center cursor-pointer transition-all',
                  'hover:border-blue-500/50 hover:bg-blue-500/[0.03]'
                )}
              >
                {fileName ? (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{fileName}</p>
                      <p className="text-[12px] text-muted-foreground">Click to choose a different file</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">Drop CSV here or click to browse</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">Supports .csv, .tsv, tab-separated</p>
                    </div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".csv,.tsv,text/csv,text/plain" className="hidden" onChange={handleFileChange} />

              {parseError && (
                <p className="flex items-center gap-1.5 text-[12px] text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {parseError}
                </p>
              )}
            </div>
          )}

          {step === 'input' && method === 'paste' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setStep('method')} className="text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <p className="text-[13px] text-muted-foreground">
                    Paste CSV or spreadsheet rows below.
                  </p>
                </div>
                <button
                  onClick={() => setRawText(sampleData)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Try sample data
                </button>
              </div>

              <textarea
                rows={10}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder={`Name,Phone,Email,Address\nJohn Smith,(555) 100-2000,john@email.com,123 Oak St\n...`}
                className="w-full resize-none rounded-lg border border-input bg-muted/20 px-3 py-2.5 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
                spellCheck={false}
              />

              {parseError && (
                <p className="flex items-center gap-1.5 text-[12px] text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {parseError}
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="h-8 text-[13px] bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                  disabled={!rawText.trim()}
                  onClick={() => {
                    if (handleParse(rawText)) setStep('mapping')
                  }}
                >
                  Continue
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: Mapping ─────────────────────────────────────────────── */}
          {step === 'mapping' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep('input')} className="text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Map your columns</p>
                  <p className="text-[12px] text-muted-foreground">
                    We auto-detected {headers.length} column{headers.length !== 1 ? 's' : ''} across {rawRows.length} rows.
                    Adjust if needed.
                  </p>
                </div>
              </div>

              {/* Auto-detect badge */}
              <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/[0.06] px-3 py-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-[12px] text-blue-700 dark:text-blue-300">
                  Columns were auto-matched. Review and correct any mismatches below.
                </p>
              </div>

              {/* Mapping table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-2 gap-0 bg-secondary/30 px-4 py-2 border-b border-border">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">CSV Column</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Maps to</span>
                </div>
                {headers.map(col => (
                  <div key={col} className="grid grid-cols-2 gap-4 px-4 py-2.5 border-b border-border/50 last:border-0 items-center">
                    <span className="text-[13px] font-medium text-foreground truncate">{col}</span>
                    <select
                      value={mapping[col] ?? 'skip'}
                      onChange={e => setMapping(prev => ({ ...prev, [col]: e.target.value as FieldKey }))}
                      className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {FIELDS.map(f => (
                        <option key={f.key} value={f.key}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Preview rows */}
              {rawRows.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Preview — first {Math.min(rawRows.length, 3)} rows
                  </p>
                  <div className="rounded-xl border border-border overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b border-border bg-secondary/20">
                          {headers.map(h => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">
                              {h}
                              {mapping[h] !== 'skip' && (
                                <span className="ml-1 text-blue-500 dark:text-blue-400 font-normal">
                                  → {FIELDS.find(f => f.key === mapping[h])?.label}
                                </span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rawRows.slice(0, 3).map((row, i) => (
                          <tr key={i}>
                            {headers.map(h => (
                              <td key={h} className={cn(
                                'px-3 py-2 text-foreground',
                                mapping[h] === 'skip' && 'text-muted-foreground/40 line-through'
                              )}>
                                {row[h] || <span className="text-muted-foreground/30">—</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  className="h-8 text-[13px] bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                  onClick={applyMapping}
                  disabled={!Object.values(mapping).some(v => v === 'name')}
                >
                  Review Import
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              {!Object.values(mapping).some(v => v === 'name') && (
                <p className="text-[11.5px] text-amber-600 dark:text-amber-400 -mt-2">
                  At least one column must map to Name to continue.
                </p>
              )}
            </div>
          )}

          {/* ── Step: Review ──────────────────────────────────────────────── */}
          {step === 'review' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setStep('mapping')} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Review import</p>
                    <p className="text-[12px] text-muted-foreground">{mappedRows.length} rows parsed</p>
                  </div>
                </div>
              </div>

              {/* Summary badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-center">
                  <div className="text-[22px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{readyCount}</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Ready</div>
                </div>
                <div className={cn(
                  'rounded-xl border px-4 py-3 text-center',
                  dupCount > 0
                    ? 'border-amber-500/20 bg-amber-500/[0.06]'
                    : 'border-border bg-muted/20 opacity-40'
                )}>
                  <div className={cn('text-[22px] font-bold tabular-nums', dupCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground')}>{dupCount}</div>
                  <div className={cn('text-[11px] font-semibold mt-0.5', dupCount > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground')}>Duplicate{dupCount !== 1 ? 's' : ''}</div>
                </div>
                <div className={cn(
                  'rounded-xl border px-4 py-3 text-center',
                  reviewCount > 0
                    ? 'border-violet-500/20 bg-violet-500/[0.06]'
                    : 'border-border bg-muted/20 opacity-40'
                )}>
                  <div className={cn('text-[22px] font-bold tabular-nums', reviewCount > 0 ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground')}>{reviewCount}</div>
                  <div className={cn('text-[11px] font-semibold mt-0.5', reviewCount > 0 ? 'text-violet-700 dark:text-violet-400' : 'text-muted-foreground')}>Needs Review</div>
                </div>
              </div>

              {/* Duplicate handling strategy */}
              {dupCount > 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 space-y-2.5">
                  <p className="text-[12px] font-semibold text-foreground">
                    Handle {dupCount} duplicate{dupCount !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { key: 'skip'  as DupStrategy, icon: SkipForward,  label: 'Skip duplicates',      desc: 'Don\'t import matches' },
                      { key: 'merge' as DupStrategy, icon: GitMerge,     label: 'Merge by email/phone', desc: 'Update existing record' },
                      { key: 'new'   as DupStrategy, icon: FilePlus,     label: 'Import as new',        desc: 'Create separate entry' },
                    ] as { key: DupStrategy; icon: React.ElementType; label: string; desc: string }[]).map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setDupStrategy(opt.key)}
                        className={cn(
                          'flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left flex-1 min-w-[140px] transition-all',
                          dupStrategy === opt.key
                            ? 'border-amber-500/50 bg-amber-500/10'
                            : 'border-border bg-card hover:border-border/80'
                        )}
                      >
                        <opt.icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', dupStrategy === opt.key ? 'text-amber-600' : 'text-muted-foreground')} />
                        <div>
                          <p className={cn('text-[12px] font-semibold', dupStrategy === opt.key ? 'text-amber-700 dark:text-amber-300' : 'text-foreground')}>
                            {opt.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Row table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-[1fr_120px_160px_80px] gap-0 bg-secondary/30 px-4 py-2.5 border-b border-border">
                  {['Name', 'Phone', 'Email', 'Status'].map(h => (
                    <span key={h} className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</span>
                  ))}
                </div>
                <div className="divide-y divide-border/50 max-h-[280px] overflow-y-auto">
                  {mappedRows.map((row, i) => {
                    const isSkipped = row._status === 'duplicate' && dupStrategy === 'skip'
                    return (
                      <div
                        key={i}
                        className={cn(
                          'grid grid-cols-[1fr_120px_160px_80px] gap-0 px-4 py-2.5 items-center',
                          isSkipped && 'opacity-40'
                        )}
                      >
                        <div className="min-w-0">
                          <span className="text-[13px] font-medium text-foreground truncate block">{row.name || <span className="text-muted-foreground/40">—</span>}</span>
                          {row._dupName && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400">Matches: {row._dupName}</span>
                          )}
                        </div>
                        <span className="text-[12px] text-muted-foreground truncate">{row.phone || '—'}</span>
                        <span className="text-[12px] text-muted-foreground truncate">{row.email || '—'}</span>
                        <div>
                          {row._status === 'ready' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Ready
                            </span>
                          )}
                          {row._status === 'duplicate' && !isSkipped && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                              <AlertTriangle className="h-3 w-3" />
                              Dup
                            </span>
                          )}
                          {row._status === 'duplicate' && isSkipped && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              <X className="h-3 w-3" />
                              Skip
                            </span>
                          )}
                          {row._status === 'review' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                              Review
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-[12px] text-muted-foreground">
                  {effectiveRows.length} client{effectiveRows.length !== 1 ? 's' : ''} will be imported
                  {dupStrategy === 'skip' && dupCount > 0 && ` · ${dupCount} skipped`}
                </p>
                <Button
                  size="sm"
                  className="h-8 text-[13px] bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                  disabled={effectiveRows.length === 0 || isImporting}
                  onClick={handleImport}
                >
                  {isImporting ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" />Importing…</>
                  ) : (
                    <>Import {effectiveRows.length} client{effectiveRows.length !== 1 ? 's' : ''}</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: Done ────────────────────────────────────────────────── */}
          {step === 'done' && result && (
            <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-foreground">Import complete</p>
                <p className="text-[13px] text-muted-foreground mt-1">
                  {result.imported} client{result.imported !== 1 ? 's' : ''} added to your list
                </p>
              </div>

              <div className="flex gap-4 text-center">
                <div className="rounded-xl border border-border bg-card px-5 py-3">
                  <div className="text-[20px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{result.imported}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Imported</div>
                </div>
                {result.skipped > 0 && (
                  <div className="rounded-xl border border-border bg-card px-5 py-3">
                    <div className="text-[20px] font-bold text-muted-foreground tabular-nums">{result.skipped}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Skipped</div>
                  </div>
                )}
                {result.failed > 0 && (
                  <div className="rounded-xl border border-border bg-card px-5 py-3">
                    <div className="text-[20px] font-bold text-destructive tabular-nums">{result.failed}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Failed</div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-[13px]"
                  onClick={() => { reset() }}
                >
                  Import more
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-[13px] bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => { reset(); onOpenChange(false) }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
