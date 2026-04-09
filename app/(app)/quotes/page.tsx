'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText, Send, CheckCircle2, TrendingUp,
  Plus, Pencil, Eye, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QuoteRow, QuoteStatus } from '@/lib/types/quotes'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(dateStr))
}

const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
  draft:     { label: 'Draft',     className: 'bg-secondary text-muted-foreground' },
  sent:      { label: 'Sent',      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  viewed:    { label: 'Viewed',    className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  approved:  { label: 'Approved',  className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  rejected:  { label: 'Rejected',  className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  expired:   { label: 'Expired',   className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  converted: { label: 'Converted', className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', cfg.className)}>
      {cfg.label}
    </span>
  )
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quotes')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setQuotes(data.quotes ?? []))
      .catch(() => setQuotes([]))
      .finally(() => setIsLoading(false))
  }, [])

  const draftCount    = quotes.filter(q => q.status === 'draft').length
  const sentCount     = quotes.filter(q => q.status === 'sent' || q.status === 'viewed').length
  const approvedCount = quotes.filter(q => q.status === 'approved').length
  const convertedCount = quotes.filter(q => q.status === 'converted').length

  const stats = [
    { label: 'Draft',     value: draftCount,     icon: FileText,    iconClass: 'text-muted-foreground', bgClass: 'bg-secondary' },
    { label: 'Sent',      value: sentCount,      icon: Send,        iconClass: 'text-blue-600',         bgClass: 'bg-blue-500/10' },
    { label: 'Approved',  value: approvedCount,  icon: CheckCircle2, iconClass: 'text-emerald-600',     bgClass: 'bg-emerald-500/10' },
    { label: 'Converted', value: convertedCount, icon: TrendingUp,  iconClass: 'text-teal-600',         bgClass: 'bg-teal-500/10' },
  ]

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* Header */}
      <div className="border-b border-border bg-card px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[17px] font-bold text-foreground">Quotes</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5">Create, send, and track quotes</p>
          </div>
          <Link href="/quotes/new">
            <Button size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px]">
              <Plus className="h-3.5 w-3.5" />
              New Quote
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 space-y-5">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-xl border border-border bg-card px-4 py-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[12px] text-muted-foreground">{stat.label}</span>
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', stat.bgClass)}>
                  <stat.icon className={cn('h-3.5 w-3.5', stat.iconClass)} />
                </div>
              </div>
              <div className="text-[24px] font-bold text-foreground leading-none">
                {isLoading ? <span className="text-muted-foreground/30">—</span> : stat.value}
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : quotes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center py-16 gap-3">
            <FileText className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-[14px] font-medium text-foreground">No quotes yet</p>
            <p className="text-[13px] text-muted-foreground">Create your first quote to get started</p>
            <Link href="/quotes/new">
              <Button size="sm" className="mt-1 h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px]">
                <Plus className="h-3.5 w-3.5" />
                Create Quote
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    {['Quote', 'Customer', 'Status', 'Amount', 'Created', 'Expires', ''].map((h, i) => (
                      <th
                        key={i}
                        className={cn(
                          'px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground',
                          i === 3 ? 'text-right' : 'text-left',
                          i === 6 ? 'text-right' : ''
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {quotes.map(quote => (
                    <tr key={quote.id} className="group hover:bg-secondary/20 transition-colors">
                      {/* Title + number */}
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/quotes/${quote.id}/edit`}
                          className="text-[13px] font-medium text-foreground hover:text-blue-600 hover:underline transition-colors block"
                        >
                          {quote.title || 'Untitled'}
                        </Link>
                        <div className="text-[11px] text-muted-foreground/60">{quote.quote_number}</div>
                      </td>
                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/quotes/${quote.id}/edit`}
                          className="text-[13px] text-foreground hover:text-blue-600 hover:underline transition-colors"
                        >
                          {quote.customer_name || '—'}
                        </Link>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={quote.status} />
                      </td>
                      {/* Amount */}
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-[13px] font-semibold tabular-nums">{formatCurrency(quote.total)}</span>
                      </td>
                      {/* Created */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-muted-foreground">{formatDate(quote.created_at)}</span>
                      </td>
                      {/* Expires */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-muted-foreground">
                          {quote.expires_at ? formatDate(quote.expires_at) : '—'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/quotes/${quote.id}/edit`}
                            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </Link>
                          <Link
                            href={`/quotes/${quote.id}/preview`}
                            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            Preview
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden space-y-2.5">
              {quotes.map(quote => (
                <div key={quote.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <Link
                        href={`/quotes/${quote.id}/edit`}
                        className="text-[14px] font-semibold text-foreground hover:text-blue-600 transition-colors block truncate"
                      >
                        {quote.title || 'Untitled'}
                      </Link>
                      <div className="text-[11px] text-muted-foreground/60">{quote.quote_number}</div>
                    </div>
                    <StatusBadge status={quote.status} />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      href={`/quotes/${quote.id}/edit`}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {quote.customer_name || '—'}
                    </Link>
                    <span className="text-[14px] font-bold tabular-nums">{formatCurrency(quote.total)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/quotes/${quote.id}/edit`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </Link>
                    <Link href={`/quotes/${quote.id}/preview`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
