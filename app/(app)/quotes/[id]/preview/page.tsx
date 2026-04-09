'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Pencil, Printer, Loader2 } from 'lucide-react'
import type { Quote, QuoteStatus } from '@/lib/types/quotes'
import { cn } from '@/lib/utils'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(dateStr))
}

const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
  draft:     { label: 'Draft',     className: 'bg-white/10 text-white/70' },
  sent:      { label: 'Sent',      className: 'bg-blue-500/20 text-blue-300' },
  viewed:    { label: 'Viewed',    className: 'bg-violet-500/20 text-violet-300' },
  approved:  { label: 'Approved',  className: 'bg-emerald-500/20 text-emerald-300' },
  rejected:  { label: 'Rejected',  className: 'bg-red-500/20 text-red-300' },
  expired:   { label: 'Expired',   className: 'bg-amber-500/20 text-amber-300' },
  converted: { label: 'Converted', className: 'bg-teal-500/20 text-teal-300' },
}

function isNearExpiry(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return diff >= 0 && diff <= 7 * 86_400_000
}

function isExpired(expiresAt: string) {
  return new Date(expiresAt) < new Date()
}

export default function QuotePreviewPage() {
  const { id } = useParams<{ id: string }>()
  const [quote, setQuote] = useState<Quote | null | 'not-found'>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/quotes/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setQuote(data.quote))
      .catch(() => setQuote('not-found'))
  }, [id])

  if (quote === null) {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (quote === 'not-found') {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex flex-col items-center justify-center gap-4 px-5">
        <div className="text-center space-y-2">
          <h1 className="text-[18px] font-bold text-foreground">Quote not found</h1>
          <p className="text-[13px] text-muted-foreground">
            This quote doesn&apos;t exist or you don&apos;t have access.
          </p>
        </div>
        <Link
          href="/quotes"
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </Link>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.draft
  const discountAmt =
    quote.discount_type === 'fixed'
      ? quote.discount_value
      : quote.discount_type === 'percent'
      ? (quote.subtotal * quote.discount_value) / 100
      : 0

  const expiryWarning = quote.expires_at
    ? isExpired(quote.expires_at) ? 'expired'
    : isNearExpiry(quote.expires_at) ? 'near'
    : null
    : null

  return (
    <div className="min-h-screen bg-muted/30 pt-14 lg:pt-0 py-8 px-4">
      {/* Top action bar */}
      <div className="mx-auto max-w-3xl mb-6 print:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/quotes"
            className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quotes
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/quotes/${id}/edit`}>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="mx-auto max-w-3xl bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

        {/* Document header */}
        <div className="bg-[#080f1e] px-8 py-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-br from-blue-600 to-indigo-700">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[16px] tracking-tight select-none">
              <span className="font-bold text-white">Auto</span>
              <span className="font-medium text-white/50">max</span>
            </span>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Quote</span>
            <div className="text-[22px] font-bold text-white">{quote.quote_number}</div>
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold', statusCfg.className)}>
              {statusCfg.label}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="px-8 py-5 border-b border-border grid sm:grid-cols-3 gap-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Created</div>
            <div className="text-[13px] text-foreground">{formatDate(quote.created_at)}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Expiration</div>
            {quote.expires_at ? (
              <div className={cn('text-[13px] font-medium',
                expiryWarning === 'expired' ? 'text-red-500'
                : expiryWarning === 'near' ? 'text-amber-500'
                : 'text-foreground'
              )}>
                {formatDate(quote.expires_at)}
                {expiryWarning === 'expired' && <span className="ml-2 text-[11px]">(Expired)</span>}
                {expiryWarning === 'near' && <span className="ml-2 text-[11px]">(Expiring soon)</span>}
              </div>
            ) : (
              <div className="text-[13px] text-muted-foreground">—</div>
            )}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Prepared by</div>
            <div className="text-[13px] text-foreground">{quote.salesperson_name || '—'}</div>
          </div>
        </div>

        {/* Bill To / Property */}
        <div className="px-8 py-6 border-b border-border grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Bill To</div>
            <div className="text-[14px] font-semibold text-foreground mb-0.5">{quote.customer_name}</div>
            {quote.customer_email && <div className="text-[13px] text-muted-foreground">{quote.customer_email}</div>}
            {quote.customer_phone && <div className="text-[13px] text-muted-foreground">{quote.customer_phone}</div>}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Property Address</div>
            <div className="text-[13px] text-foreground leading-relaxed">{quote.property_address || '—'}</div>
          </div>
        </div>

        {/* Line items */}
        <div className="px-8 py-6 border-b border-border">
          <div className="text-[13px] font-bold text-foreground mb-4">Services</div>
          <div className="hidden sm:grid sm:grid-cols-[1fr_60px_100px_100px] gap-4 mb-2 pb-2 border-b border-border/60">
            {['Item', 'Qty', 'Unit Price', 'Total'].map((h, i) => (
              <div key={h} className={cn('text-[11px] font-semibold uppercase tracking-wide text-muted-foreground', i > 0 && 'text-right')}>{h}</div>
            ))}
          </div>
          <div className="divide-y divide-border/50">
            {quote.items.map(item => (
              <div key={item.id} className="py-3.5 grid sm:grid-cols-[1fr_60px_100px_100px] gap-2 sm:gap-4">
                <div>
                  <div className="text-[13px] font-medium text-foreground">{item.name}</div>
                  {item.description && <div className="text-[12px] text-muted-foreground mt-0.5">{item.description}</div>}
                </div>
                <div className="text-[13px] text-foreground tabular-nums sm:text-right">
                  <span className="sm:hidden text-muted-foreground">Qty: </span>{item.quantity}
                </div>
                <div className="text-[13px] text-foreground tabular-nums sm:text-right">
                  <span className="sm:hidden text-muted-foreground">Unit: </span>{formatCurrency(item.unit_price)}
                </div>
                <div className="text-[13px] font-semibold text-foreground tabular-nums sm:text-right">
                  {formatCurrency(item.line_total)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-border space-y-2 sm:max-w-xs sm:ml-auto">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-muted-foreground">Subtotal</span>
              <span className="text-[13px] tabular-nums">{formatCurrency(quote.subtotal)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">
                  Discount{quote.discount_type === 'percent' && ` (${quote.discount_value}%)`}
                </span>
                <span className="text-[13px] text-emerald-600 tabular-nums font-medium">−{formatCurrency(discountAmt)}</span>
              </div>
            )}
            {quote.tax_amount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">Tax</span>
                <span className="text-[13px] tabular-nums">{formatCurrency(quote.tax_amount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-[14px] font-bold text-foreground">Total</span>
              <span className="text-[20px] font-bold tabular-nums">{formatCurrency(quote.total)}</span>
            </div>
            {quote.deposit_required && quote.deposit_amount > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-muted-foreground">
                  Deposit{quote.deposit_type === 'percent' && ` (${quote.deposit_amount}%)`}
                </span>
                <span className="text-[12px] font-medium tabular-nums text-blue-600">
                  {quote.deposit_type === 'fixed'
                    ? formatCurrency(quote.deposit_amount)
                    : formatCurrency((quote.total * quote.deposit_amount) / 100)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Terms */}
        {quote.terms && (
          <div className="px-8 py-6 border-b border-border">
            <div className="text-[13px] font-bold text-foreground mb-3">Terms &amp; Conditions</div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{quote.terms}</p>
          </div>
        )}

        {/* Approval placeholder */}
        <div className="px-8 py-8 bg-secondary/20">
          <div className="text-[15px] font-bold text-foreground mb-1">Ready to approve?</div>
          <p className="text-[13px] text-muted-foreground mb-5">
            To accept this quote, contact us or reply to this message.
          </p>
          <button
            disabled
            className="flex items-center justify-center rounded-lg bg-blue-600/40 text-white/60 font-semibold px-5 py-2.5 text-[13px] cursor-not-allowed select-none"
          >
            Approve Online — Coming Soon
          </button>
          {quote.expires_at && (
            <p className="mt-4 text-[12px] text-muted-foreground">
              This quote is valid until{' '}
              <span className={cn('font-medium',
                expiryWarning === 'expired' ? 'text-red-500'
                : expiryWarning === 'near' ? 'text-amber-500'
                : 'text-foreground'
              )}>
                {formatDate(quote.expires_at)}
              </span>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
