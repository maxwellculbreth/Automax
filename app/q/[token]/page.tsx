'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { Quote, QuoteStatus } from '@/lib/types/quotes'
import { cn } from '@/lib/utils'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  }).format(new Date(dateStr))
}

const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
  draft:     { label: 'Draft',     className: 'bg-white/10 text-white/60' },
  sent:      { label: 'Sent',      className: 'bg-blue-500/20 text-blue-300' },
  viewed:    { label: 'Viewed',    className: 'bg-violet-500/20 text-violet-300' },
  approved:  { label: 'Approved',  className: 'bg-emerald-500/20 text-emerald-300' },
  rejected:  { label: 'Rejected',  className: 'bg-red-500/20 text-red-300' },
  expired:   { label: 'Expired',   className: 'bg-amber-500/20 text-amber-300' },
  converted: { label: 'Converted', className: 'bg-teal-500/20 text-teal-300' },
}

export default function PublicQuotePage() {
  const { token } = useParams<{ token: string }>()
  const [quote, setQuote] = useState<Quote | null | 'not-found'>(null)

  useEffect(() => {
    if (!token) return
    fetch(`/api/q/${token}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setQuote(data.quote))
      .catch(() => setQuote('not-found'))
  }, [token])

  if (quote === null) {
    return (
      <div className="min-h-screen bg-[#080f1e] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    )
  }

  if (quote === 'not-found') {
    return (
      <div className="min-h-screen bg-[#080f1e] flex flex-col items-center justify-center gap-3 px-5 text-center">
        <div className="text-[18px] font-bold text-white">Quote not found</div>
        <p className="text-[13px] text-white/40 max-w-xs">
          This link may have expired or the quote is no longer available. Contact the business directly for a new copy.
        </p>
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

  const isExpired = quote.expires_at ? new Date(quote.expires_at) < new Date() : false
  const isNearExpiry = quote.expires_at
    ? !isExpired && (new Date(quote.expires_at).getTime() - Date.now() <= 7 * 86_400_000)
    : false

  return (
    <div className="min-h-screen bg-[#0a1120] py-8 px-4">

      {/* Automax branding bar */}
      <div className="mx-auto max-w-3xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-600 to-indigo-700">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[14px] tracking-tight">
            <span className="font-bold text-white">Auto</span>
            <span className="font-light text-white/40">max</span>
          </span>
        </div>
        <div className="text-[12px] text-white/30">Quote {quote.quote_number}</div>
      </div>

      {/* Quote document */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/8 bg-[#0d1831] overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="bg-[#080f1e] px-8 py-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-1">Prepared for</div>
            <div className="text-[20px] font-bold text-white">{quote.customer_name || '—'}</div>
            {quote.customer_email && <div className="text-[13px] text-white/45 mt-0.5">{quote.customer_email}</div>}
            {quote.customer_phone && <div className="text-[13px] text-white/45">{quote.customer_phone}</div>}
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Quote</div>
            <div className="text-[24px] font-bold text-white">{quote.quote_number}</div>
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold', statusCfg.className)}>
              {statusCfg.label}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="px-8 py-5 border-b border-white/6 grid sm:grid-cols-3 gap-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-white/30 mb-1">Created</div>
            <div className="text-[13px] text-white/80">{formatDate(quote.created_at)}</div>
          </div>
          {quote.expires_at && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-white/30 mb-1">Valid Until</div>
              <div className={cn('text-[13px] font-medium',
                isExpired ? 'text-red-400'
                : isNearExpiry ? 'text-amber-400'
                : 'text-white/80'
              )}>
                {formatDate(quote.expires_at)}
                {isExpired && <span className="ml-2 text-[11px]">(Expired)</span>}
                {isNearExpiry && <span className="ml-2 text-[11px]">(Expiring soon)</span>}
              </div>
            </div>
          )}
          {quote.property_address && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-white/30 mb-1">Property</div>
              <div className="text-[13px] text-white/80 leading-snug">{quote.property_address}</div>
            </div>
          )}
        </div>

        {/* Line items */}
        <div className="px-8 py-6 border-b border-white/6">
          <div className="text-[12px] font-bold uppercase tracking-wider text-white/30 mb-4">Services</div>
          <div className="hidden sm:grid sm:grid-cols-[1fr_60px_100px_100px] gap-4 mb-2 pb-2 border-b border-white/6">
            {['Item', 'Qty', 'Unit Price', 'Total'].map((h, i) => (
              <div key={h} className={cn('text-[11px] font-semibold uppercase tracking-wide text-white/30', i > 0 && 'text-right')}>{h}</div>
            ))}
          </div>
          <div className="divide-y divide-white/5">
            {quote.items.map(item => (
              <div key={item.id} className="py-3.5 grid sm:grid-cols-[1fr_60px_100px_100px] gap-2 sm:gap-4">
                <div>
                  <div className="text-[13px] font-semibold text-white/90">{item.name}</div>
                  {item.description && <div className="text-[12px] text-white/40 mt-0.5">{item.description}</div>}
                </div>
                <div className="text-[13px] text-white/70 tabular-nums sm:text-right">
                  <span className="sm:hidden text-white/30">Qty: </span>{item.quantity}
                </div>
                <div className="text-[13px] text-white/70 tabular-nums sm:text-right">
                  <span className="sm:hidden text-white/30">Unit: </span>{formatCurrency(item.unit_price)}
                </div>
                <div className="text-[13px] font-semibold text-white/90 tabular-nums sm:text-right">
                  {formatCurrency(item.line_total)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-4 border-t border-white/8 space-y-2.5 sm:max-w-xs sm:ml-auto">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/40">Subtotal</span>
              <span className="text-[13px] text-white/80 tabular-nums">{formatCurrency(quote.subtotal)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/40">
                  Discount{quote.discount_type === 'percent' && ` (${quote.discount_value}%)`}
                </span>
                <span className="text-[13px] text-emerald-400 tabular-nums font-medium">−{formatCurrency(discountAmt)}</span>
              </div>
            )}
            {quote.tax_amount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/40">Tax</span>
                <span className="text-[13px] text-white/80 tabular-nums">{formatCurrency(quote.tax_amount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-white/8 pt-3">
              <span className="text-[15px] font-bold text-white">Total</span>
              <span className="text-[22px] font-bold text-white tabular-nums">{formatCurrency(quote.total)}</span>
            </div>
            {quote.deposit_required && quote.deposit_amount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/40">Deposit required</span>
                <span className="text-[13px] font-semibold text-blue-400 tabular-nums">
                  {formatCurrency(quote.deposit_amount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Terms */}
        {quote.terms && (
          <div className="px-8 py-6 border-b border-white/6">
            <div className="text-[12px] font-bold uppercase tracking-wider text-white/30 mb-3">Terms &amp; Conditions</div>
            <p className="text-[13px] text-white/45 leading-relaxed">{quote.terms}</p>
          </div>
        )}

        {/* CTA */}
        <div className="px-8 py-8 bg-white/[0.02]">
          <div className="text-[15px] font-bold text-white mb-1">Questions or ready to book?</div>
          <p className="text-[13px] text-white/45 leading-relaxed mb-5 max-w-md">
            Reply to the message you received or contact us directly. We&apos;re happy to walk through the quote with you.
          </p>
          {isExpired ? (
            <div className="inline-flex items-center rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[13px] font-medium text-red-400">
              This quote has expired — contact us for an updated quote.
            </div>
          ) : (
            <div className="inline-flex items-center rounded-lg border border-blue-500/25 bg-blue-500/10 px-4 py-2.5 text-[13px] font-medium text-blue-300">
              Quote is valid{quote.expires_at ? ` until ${formatDate(quote.expires_at)}` : ''}.
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-white/20 mt-8">
        Powered by <span className="text-white/35 font-medium">Automax</span>
      </p>
    </div>
  )
}
