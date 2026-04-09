'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, FileText, User, AlignLeft, CreditCard,
  Trash2, Plus, LayoutTemplate, ChevronDown, Check,
  Eye, Copy, Send, MessageSquare, Mail, X, Loader2, Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Quote, QuoteItem, DiscountType, DepositType, QuoteStatus, QuoteTemplate } from '@/lib/types/quotes'
import { QUOTE_TEMPLATES } from '@/lib/data/demo-quotes'
import { ClientPicker } from '@/components/quotes/client-picker'
import type { PickedClient } from '@/components/quotes/client-picker'

interface QuoteFormProps {
  initialData?: Partial<Quote>
  mode: 'create' | 'edit'
  quoteId?: string
}

const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: 'draft',     label: 'Draft' },
  { value: 'sent',      label: 'Sent' },
  { value: 'viewed',    label: 'Viewed' },
  { value: 'approved',  label: 'Approved' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'expired',   label: 'Expired' },
  { value: 'converted', label: 'Converted' },
]

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function makeEmptyItem(): QuoteItem {
  return { id: crypto.randomUUID(), name: '', description: '', quantity: 1, unit_price: 0, line_total: 0, position: 0 }
}

function computeExpiryDate(preset: string): string {
  const days = parseInt(preset)
  if (isNaN(days)) return ''
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function detectExpiryPreset(isoDate: string): string {
  const diff = Math.round((new Date(isoDate).getTime() - Date.now()) / 86400000)
  if (diff <= 1) return '1'
  if (diff >= 6 && diff <= 8) return '7'
  if (diff >= 13 && diff <= 15) return '14'
  if (diff >= 28 && diff <= 32) return '30'
  if (diff >= 58 && diff <= 62) return '60'
  return 'custom'
}

export function QuoteForm({ initialData, mode, quoteId }: QuoteFormProps) {
  const router = useRouter()

  const [title,           setTitle]           = useState(initialData?.title || '')
  const [status,          setStatus]          = useState<QuoteStatus>(initialData?.status || 'draft')
  const [expiresAt,       setExpiresAt]       = useState(() => {
    if (initialData?.expires_at) return initialData.expires_at.split('T')[0]
    if (mode === 'create') return computeExpiryDate('30')
    return ''
  })
  const [salesperson,     setSalesperson]     = useState(initialData?.salesperson_name || '')
  const [customerName,    setCustomerName]    = useState(initialData?.customer_name || '')
  const [customerEmail,   setCustomerEmail]   = useState(initialData?.customer_email || '')
  const [customerPhone,   setCustomerPhone]   = useState(initialData?.customer_phone || '')
  const [propertyAddress, setPropertyAddress] = useState(initialData?.property_address || '')
  const [items,           setItems]           = useState<QuoteItem[]>(
    initialData?.items?.length ? initialData.items : [makeEmptyItem()]
  )
  const [discountType,    setDiscountType]    = useState<DiscountType | null>(initialData?.discount_type || null)
  const [discountValue,   setDiscountValue]   = useState(initialData?.discount_value || 0)
  const [taxAmount,       setTaxAmount]       = useState(initialData?.tax_amount || 0)
  const [terms,           setTerms]           = useState(
    initialData?.terms || 'Payment is due upon completion of services. Cancellations require 24-hour advance notice.'
  )
  const [notes,           setNotes]           = useState(initialData?.notes || '')
  const [depositRequired, setDepositRequired] = useState(initialData?.deposit_required || false)
  const [depositType,     setDepositType]     = useState<DepositType>(initialData?.deposit_type || 'fixed')
  const [depositAmount,   setDepositAmount]   = useState(initialData?.deposit_amount || 0)

  const [showTemplates,   setShowTemplates]   = useState(false)
  const [isSaving,        setIsSaving]        = useState(false)
  const [savedStatus,     setSavedStatus]     = useState<'idle' | 'saved'>('idle')
  const [showSendPanel,   setShowSendPanel]   = useState(false)
  const [isSending,       setIsSending]       = useState(false)
  const [showClientPicker, setShowClientPicker] = useState(false)
  const [expiryPreset,    setExpiryPreset]    = useState<string>(() => {
    if (!initialData?.expires_at) return mode === 'create' ? '30' : 'none'
    return detectExpiryPreset(initialData.expires_at)
  })

  const subtotal    = useMemo(() => items.reduce((s, i) => s + i.line_total, 0), [items])
  const discountAmt = useMemo(() => {
    if (!discountType || discountValue <= 0) return 0
    return discountType === 'fixed' ? discountValue : (subtotal * discountValue) / 100
  }, [discountType, discountValue, subtotal])
  const total = useMemo(() => subtotal - discountAmt + taxAmount, [subtotal, discountAmt, taxAmount])

  const quoteNumber = initialData?.quote_number || (mode === 'create' ? 'Auto-generated on save' : '—')

  // ── Item helpers ────────────────────────────────────────────────────────────

  function addItem() {
    setItems(prev => [...prev, { ...makeEmptyItem(), position: prev.length }])
  }

  function removeItem(id: string) {
    if (items.length <= 1) return
    setItems(prev => prev.filter(item => item.id !== id))
  }

  function updateItem(id: string, field: keyof QuoteItem, value: string | number) {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unit_price') {
          const qty   = field === 'quantity'   ? Number(value) : item.quantity
          const price = field === 'unit_price' ? Number(value) : item.unit_price
          updated.line_total = qty * price
        }
        return updated
      })
    )
  }

  function applyTemplate(tpl: QuoteTemplate) {
    setItems(tpl.items.map(item => ({ ...item, id: crypto.randomUUID() })))
    if (!title) setTitle(tpl.name)
    setShowTemplates(false)
  }

  function handleClientSelect(client: PickedClient) {
    setCustomerName(client.full_name)
    if (client.phone) setCustomerPhone(client.phone)
    if (client.email) setCustomerEmail(client.email)
    if (client.address) setPropertyAddress(client.address)
  }

  function handleExpiryPresetChange(preset: string) {
    setExpiryPreset(preset)
    if (preset !== 'none' && preset !== 'custom') {
      setExpiresAt(computeExpiryDate(preset))
    } else if (preset === 'none') {
      setExpiresAt('')
    }
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  function buildPayload(statusOverride?: QuoteStatus) {
    return {
      title,
      status: statusOverride ?? status,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      salesperson_name: salesperson,
      customer_name: customerName,
      customer_email: customerEmail || null,
      customer_phone: customerPhone || null,
      property_address: propertyAddress || null,
      subtotal,
      discount_type: discountType,
      discount_value: discountValue,
      tax_amount: taxAmount,
      total,
      terms,
      notes,
      deposit_required: depositRequired,
      deposit_type: depositRequired ? depositType : null,
      deposit_amount: depositRequired ? depositAmount : 0,
      payment_status: 'none' as const,
      items: items.map((item, i) => ({ ...item, position: i })),
    }
  }

  async function handleSave(statusOverride?: QuoteStatus) {
    setIsSaving(true)
    try {
      const payload = buildPayload(statusOverride)

      if (mode === 'create') {
        const res = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create quote')
        const { quote } = await res.json()
        router.push(`/quotes/${quote.id}/edit`)
      } else {
        if (statusOverride) setStatus(statusOverride)
        const res = await fetch(`/api/quotes/${quoteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to save quote')
        setSavedStatus('saved')
        setTimeout(() => setSavedStatus('idle'), 2500)
      }
    } catch (err) {
      toast.error('Failed to save', { description: err instanceof Error ? err.message : undefined })
    } finally {
      setIsSaving(false)
    }
  }

  // ── Send ────────────────────────────────────────────────────────────────────

  function handleSendClick() {
    if (mode === 'create' || !quoteId) {
      toast.error('Save the quote first before sending')
      return
    }
    setShowSendPanel(prev => !prev)
  }

  async function handleSend(channel: 'sms' | 'email') {
    if (!quoteId) return
    setIsSending(true)
    try {
      const res = await fetch(`/api/quotes/${quoteId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Send failed')
      setStatus('sent')
      setShowSendPanel(false)
      const label = channel === 'sms' ? 'SMS' : 'Email'
      toast.success(data.mock ? `Queued (mock ${label})` : `Quote sent via ${label}`)
    } catch (err) {
      toast.error('Send failed', { description: err instanceof Error ? err.message : undefined })
    } finally {
      setIsSending(false)
    }
  }

  const headerTitle = mode === 'create' ? 'New Quote' : title || 'Edit Quote'

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-card px-5 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/quotes"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-[15px] font-semibold text-foreground truncate">{headerTitle}</h1>
                <p className="text-[12px] text-muted-foreground">{quoteNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {savedStatus === 'saved' && (
                <span className="flex items-center gap-1 text-[12px] text-emerald-600 font-medium">
                  <Check className="h-3.5 w-3.5" />
                  Saved
                </span>
              )}
              {mode === 'edit' && quoteId && (
                <Link href={`/quotes/${quoteId}/preview`}>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[13px]">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>
                </Link>
              )}
              {mode === 'edit' && quoteId && (
                <Link href={`/quotes/new?duplicate=${quoteId}`}>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[13px]">
                    <Copy className="h-3.5 w-3.5" />
                    Duplicate
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[13px]"
                onClick={() => handleSave()}
                disabled={isSaving}
              >
                {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving…</> : 'Save Draft'}
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px]"
                onClick={handleSendClick}
                disabled={isSaving}
              >
                <Send className="h-3.5 w-3.5" />
                Send Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Send panel ──────────────────────────────────────────────────────── */}
      {showSendPanel && (
        <div className="border-b border-border bg-blue-500/5 px-5 py-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-[13px] font-semibold text-foreground">Send to {customerName || 'customer'}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {customerPhone && <span className="mr-3">{customerPhone}</span>}
                  {customerEmail && <span>{customerEmail}</span>}
                  {!customerPhone && !customerEmail && 'Add phone or email to the quote first'}
                </p>
              </div>
              <button onClick={() => setShowSendPanel(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-[13px]"
                disabled={!customerPhone || isSending}
                onClick={() => handleSend('sms')}
              >
                {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquare className="h-3.5 w-3.5" />}
                Send via SMS
                {!customerPhone && <span className="text-muted-foreground/60 ml-1 text-[11px]">(no phone)</span>}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-[13px]"
                disabled={!customerEmail || isSending}
                onClick={() => handleSend('email')}
              >
                {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                Send via Email
                {!customerEmail && <span className="text-muted-foreground/60 ml-1 text-[11px]">(no email)</span>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="px-5 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_296px]">

          {/* Main column */}
          <div className="space-y-5">

            {/* Quote Details */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
                <FileText className="h-[15px] w-[15px] text-muted-foreground" />
                <span className="text-[13px] font-semibold text-foreground">Quote Details</span>
              </div>
              <div className="p-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-[12px] font-medium">Quote Title</Label>
                  <Input className="h-9 text-[13px]" placeholder="e.g. House Wash — 142 Oakwood Drive" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Quote #</Label>
                  <Input className="h-9 text-[13px] bg-secondary/50 text-muted-foreground" value={quoteNumber} readOnly />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Status</Label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={status}
                    onChange={e => setStatus(e.target.value as QuoteStatus)}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Expires In</Label>
                  <div className="flex gap-2">
                    <select
                      className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      value={expiryPreset}
                      onChange={e => handleExpiryPresetChange(e.target.value)}
                    >
                      <option value="none">No expiry</option>
                      <option value="1">1 day</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="custom">Custom date</option>
                    </select>
                    {expiryPreset === 'custom' && (
                      <Input
                        type="date"
                        className="h-9 text-[13px] flex-1"
                        value={expiresAt}
                        onChange={e => setExpiresAt(e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Salesperson</Label>
                  <Input className="h-9 text-[13px]" placeholder="Name" value={salesperson} onChange={e => setSalesperson(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <User className="h-[15px] w-[15px] text-muted-foreground" />
                  <span className="text-[13px] font-semibold text-foreground">Client Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClientPicker(true)}
                  className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <Users className="h-3.5 w-3.5" />
                  Select Client
                </button>
              </div>
              <div className="p-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Customer Name</Label>
                  <Input className="h-9 text-[13px]" placeholder="Full name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Phone</Label>
                  <Input className="h-9 text-[13px]" placeholder="(555) 000-0000" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Email</Label>
                  <Input type="email" className="h-9 text-[13px]" placeholder="customer@email.com" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Property Address</Label>
                  <Input className="h-9 text-[13px]" placeholder="123 Main St, City, State" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                <span className="text-[13px] font-semibold text-foreground">Line Items</span>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  Templates
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showTemplates && 'rotate-180')} />
                </button>
              </div>

              {showTemplates && (
                <div className="border-b border-border px-5 py-4">
                  <p className="mb-3 text-[12px] text-muted-foreground">Select a template to pre-fill line items</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {QUOTE_TEMPLATES.map(tpl => (
                      <button
                        key={tpl.id}
                        onClick={() => applyTemplate(tpl)}
                        className="flex items-start gap-3 rounded-lg border border-border bg-background px-3.5 py-3 text-left hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
                      >
                        <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                        <div>
                          <div className="text-[13px] font-medium text-foreground">{tpl.name}</div>
                          <div className="text-[12px] text-muted-foreground">{tpl.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-5 pt-4 pb-2">
                <div className="mb-2 hidden sm:grid sm:grid-cols-[1fr_160px_90px_90px_90px_36px] gap-3">
                  {['Item', 'Description', 'Qty', 'Unit Price', 'Total', ''].map((h, i) => (
                    <div key={i} className={cn('text-[11px] font-medium text-muted-foreground uppercase tracking-wide', i >= 2 && i <= 4 && 'text-right')}>{h}</div>
                  ))}
                </div>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_160px_90px_90px_90px_36px] items-center">
                      <Input className="h-8 text-[13px]" placeholder="Item name" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} />
                      <Input className="h-8 text-[13px]" placeholder="Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                      <Input type="number" min={1} className="h-8 text-[13px] text-right" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                      <div className="relative">
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground">$</span>
                        <Input type="number" min={0} step={0.01} className="h-8 text-[13px] text-right pl-5" value={item.unit_price} onChange={e => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="flex h-8 items-center justify-end text-[13px] font-medium tabular-nums">{formatCurrency(item.line_total)}</div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        className={cn('flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors',
                          items.length > 1 ? 'hover:border-red-300 hover:text-red-500 hover:bg-red-500/5' : 'opacity-30 cursor-not-allowed'
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-3">
                <button onClick={addItem} className="flex items-center gap-1.5 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Line Item
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
                <AlignLeft className="h-[15px] w-[15px] text-muted-foreground" />
                <span className="text-[13px] font-semibold text-foreground">Terms &amp; Disclaimer</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Terms &amp; Conditions</Label>
                  <textarea rows={5} className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={terms} onChange={e => setTerms(e.target.value)} placeholder="Payment terms, cancellation policy, etc." />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-[12px] font-medium">Internal Notes</Label>
                    <span className="text-[11px] text-muted-foreground">(not shown to client)</span>
                  </div>
                  <textarea rows={2} className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes for your team only…" />
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:sticky lg:top-6 space-y-5 h-fit">

            {/* Pricing Summary */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-3.5">
                <span className="text-[13px] font-semibold text-foreground">Pricing Summary</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-muted-foreground">Subtotal</span>
                  <span className="text-[13px] font-medium tabular-nums">{formatCurrency(subtotal)}</span>
                </div>

                {/* Discount */}
                <div className="space-y-2">
                  <Label className="text-[12px] font-medium">Discount</Label>
                  <div className="flex gap-2">
                    <select
                      className="h-9 flex-shrink-0 w-28 rounded-md border border-input bg-background px-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      value={discountType || 'none'}
                      onChange={e => {
                        const v = e.target.value
                        setDiscountType(v === 'none' ? null : (v as DiscountType))
                        if (v === 'none') setDiscountValue(0)
                      }}
                    >
                      <option value="none">None</option>
                      <option value="fixed">Fixed $</option>
                      <option value="percent">Percent %</option>
                    </select>
                    {discountType && (
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground">
                          {discountType === 'fixed' ? '$' : '%'}
                        </span>
                        <Input type="number" min={0} step={discountType === 'percent' ? 1 : 0.01} className="h-9 text-[13px] pl-6" value={discountValue} onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)} />
                      </div>
                    )}
                  </div>
                  {discountAmt > 0 && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">Discount applied</span>
                      <span className="text-emerald-600 font-medium tabular-nums">−{formatCurrency(discountAmt)}</span>
                    </div>
                  )}
                </div>

                {/* Tax */}
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium">Tax</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground">$</span>
                    <Input type="number" min={0} step={0.01} className="h-9 text-[13px] pl-6" value={taxAmount} onChange={e => setTaxAmount(parseFloat(e.target.value) || 0)} />
                  </div>
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-foreground">Total</span>
                  <span className="text-[18px] font-bold tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Deposit */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
                <CreditCard className="h-[15px] w-[15px] text-muted-foreground" />
                <span className="text-[13px] font-semibold text-foreground">Deposit</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-foreground">Require deposit</span>
                  <button
                    onClick={() => setDepositRequired(!depositRequired)}
                    className={cn('relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200', depositRequired ? 'bg-blue-600' : 'bg-input')}
                  >
                    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200', depositRequired ? 'translate-x-4' : 'translate-x-0')} />
                  </button>
                </div>
                {depositRequired && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[12px] font-medium">Deposit Type</Label>
                      <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={depositType} onChange={e => setDepositType(e.target.value as DepositType)}>
                        <option value="fixed">Fixed $</option>
                        <option value="percent">Percent %</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px] font-medium">Deposit Amount</Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground">
                          {depositType === 'fixed' ? '$' : '%'}
                        </span>
                        <Input type="number" min={0} step={depositType === 'percent' ? 1 : 0.01} className="h-9 text-[13px] pl-6" value={depositAmount} onChange={e => setDepositAmount(parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="rounded-lg border border-dashed border-border bg-secondary/20 px-3.5 py-3">
                  <p className="text-[12px] font-medium text-foreground mb-0.5">Payment Request</p>
                  <p className="text-[12px] text-muted-foreground">Send a payment link to the client. Coming soon.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ClientPicker
        open={showClientPicker}
        onOpenChange={setShowClientPicker}
        onSelect={handleClientSelect}
      />
    </div>
  )
}
