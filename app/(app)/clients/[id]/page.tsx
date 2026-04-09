'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Phone, Mail, MapPin, Briefcase,
  FileText, DollarSign, Clock, Loader2, Plus,
  Edit2, Check, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Client {
  id: string
  full_name: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  status: string
  source: string | null
  notes: string | null
  total_revenue: number
  total_jobs: number
  total_quotes: number
  last_activity_at: string | null
  last_job_at: string | null
  last_quote_at: string | null
  created_at: string
}

interface RelatedQuote {
  id: string
  quote_number: string
  quote_title: string
  status: string
  total: number
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active:   { label: 'Active',   className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  vip:      { label: 'VIP',      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  inactive: { label: 'Inactive', className: 'bg-secondary text-muted-foreground' },
}

const QUOTE_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft:     { label: 'Draft',     className: 'bg-secondary text-muted-foreground' },
  sent:      { label: 'Sent',      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  viewed:    { label: 'Viewed',    className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  approved:  { label: 'Approved',  className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  rejected:  { label: 'Rejected',  className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  expired:   { label: 'Expired',   className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  converted: { label: 'Converted', className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr))
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return 'Never'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [client, setClient]   = useState<Client | null | 'not-found'>(null)
  const [quotes, setQuotes]   = useState<RelatedQuote[]>([])
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes]     = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/clients/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setClient(data.client)
        setNotes(data.client.notes ?? '')
        setQuotes(data.quotes ?? [])
      })
      .catch(() => setClient('not-found'))
  }, [id])

  async function saveNotes() {
    if (!client || client === 'not-found') return
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (!res.ok) throw new Error()
      setClient({ ...client, notes })
      setEditingNotes(false)
      toast.success('Notes saved')
    } catch {
      toast.error('Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  if (client === null) {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (client === 'not-found') {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex flex-col items-center justify-center gap-4 px-5">
        <p className="text-[14px] font-medium text-foreground">Client not found</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/clients')}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Clients
        </Button>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[client.status] ?? STATUS_CONFIG.active

  const statCards = [
    { label: 'Total Jobs',   value: client.total_jobs,    icon: Briefcase,  color: 'text-blue-600',    bg: 'bg-blue-500/10' },
    { label: 'Quotes Sent',  value: client.total_quotes,  icon: FileText,   color: 'text-violet-600',  bg: 'bg-violet-500/10' },
    { label: 'Revenue',      value: formatCurrency(client.total_revenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Last Activity',value: timeAgo(client.last_activity_at), icon: Clock, color: 'text-muted-foreground', bg: 'bg-secondary' },
  ]

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* Header */}
      <div className="border-b border-border bg-card px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/clients"
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Clients
          </Link>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 font-bold text-[15px] select-none">
              {client.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-foreground leading-tight">{client.full_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', statusCfg.className)}>
                  {statusCfg.label}
                </span>
                {client.source && (
                  <span className="text-[12px] text-muted-foreground">via {client.source}</span>
                )}
                <span className="text-[12px] text-muted-foreground">· Since {formatDate(client.created_at)}</span>
              </div>
            </div>
          </div>
          <Link href={`/quotes/new?client=${id}`}>
            <Button size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] flex-shrink-0">
              <Plus className="h-3.5 w-3.5" />
              New Quote
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 space-y-5 max-w-4xl">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
                <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', s.bg)}>
                  <s.icon className={cn('h-3 w-3', s.color)} />
                </div>
              </div>
              <div className="text-[18px] font-bold text-foreground leading-none tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">

          {/* Left — Contact + Notes */}
          <div className="space-y-5">

            {/* Contact info */}
            <div className="rounded-xl border border-border bg-card">
              <div className="px-5 py-3.5 border-b border-border">
                <span className="text-[13px] font-semibold text-foreground">Contact Information</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-[13px] text-foreground">{client.phone || <span className="text-muted-foreground">No phone</span>}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-[13px] text-foreground">{client.email || <span className="text-muted-foreground">No email</span>}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-foreground leading-relaxed">
                    {client.address || <span className="text-muted-foreground">No address</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-border bg-card">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                <span className="text-[13px] font-semibold text-foreground">Notes</span>
                {!editingNotes ? (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setNotes(client.notes ?? ''); setEditingNotes(false) }}
                      className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={saveNotes}
                      disabled={savingNotes}
                      className="flex items-center gap-1 text-[12px] text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                    >
                      {savingNotes ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Save
                    </button>
                  </div>
                )}
              </div>
              <div className="px-5 py-4">
                {editingNotes ? (
                  <textarea
                    rows={4}
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add notes about this client…"
                    autoFocus
                  />
                ) : (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {client.notes || 'No notes yet.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right — Activity */}
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card">
              <div className="px-5 py-3.5 border-b border-border">
                <span className="text-[13px] font-semibold text-foreground">Activity</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">Last activity</span>
                  <span className="text-[12px] font-medium text-foreground">{timeAgo(client.last_activity_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">Last quote</span>
                  <span className="text-[12px] font-medium text-foreground">{timeAgo(client.last_quote_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">Last job</span>
                  <span className="text-[12px] font-medium text-foreground">{timeAgo(client.last_job_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">Client since</span>
                  <span className="text-[12px] font-medium text-foreground">{formatDate(client.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Quotes */}
        <div className="rounded-xl border border-border bg-card">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <span className="text-[13px] font-semibold text-foreground">Quotes</span>
            <Link href={`/quotes/new?client=${id}`}>
              <button className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 font-medium transition-colors">
                <Plus className="h-3.5 w-3.5" />
                New Quote
              </button>
            </Link>
          </div>
          {quotes.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <FileText className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-[13px] text-muted-foreground">No quotes found for this client</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {quotes.map(q => {
                const qcfg = QUOTE_STATUS_CONFIG[q.status] ?? QUOTE_STATUS_CONFIG.draft
                return (
                  <Link
                    key={q.id}
                    href={`/quotes/${q.id}/edit`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/20 transition-colors group"
                  >
                    <div>
                      <div className="text-[13px] font-medium text-foreground group-hover:text-blue-600 transition-colors">
                        {q.quote_title || 'Untitled'}
                      </div>
                      <div className="text-[11px] text-muted-foreground/60 mt-0.5">{q.quote_number} · {formatDate(q.created_at)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', qcfg.className)}>
                        {qcfg.label}
                      </span>
                      <span className="text-[13px] font-semibold tabular-nums">{formatCurrency(q.total)}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
