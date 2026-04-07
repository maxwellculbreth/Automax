'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Send,
  CheckCircle2,
  TrendingUp,
  Plus,
  Pencil,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DEMO_QUOTES } from '@/lib/data/demo-quotes'
import type { Quote, QuoteStatus } from '@/lib/types/quotes'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr))
}

const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-secondary text-muted-foreground' },
  sent: { label: 'Sent', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  viewed: { label: 'Viewed', className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  approved: { label: 'Approved', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  expired: { label: 'Expired', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  converted: { label: 'Converted', className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
        cfg.className
      )}
    >
      {cfg.label}
    </span>
  )
}

export default function QuotesPage() {
  const quotes = DEMO_QUOTES

  const draftCount = quotes.filter((q) => q.status === 'draft').length
  const sentCount = quotes.filter((q) => q.status === 'sent' || q.status === 'viewed').length
  const approvedCount = quotes.filter((q) => q.status === 'approved').length
  const convertedCount = quotes.filter((q) => q.status === 'converted').length

  const stats = [
    {
      label: 'Draft Quotes',
      value: draftCount,
      icon: FileText,
      iconClass: 'text-muted-foreground',
      bgClass: 'bg-secondary',
    },
    {
      label: 'Sent Quotes',
      value: sentCount,
      icon: Send,
      iconClass: 'text-blue-600',
      bgClass: 'bg-blue-500/10',
    },
    {
      label: 'Approved',
      value: approvedCount,
      icon: CheckCircle2,
      iconClass: 'text-emerald-600',
      bgClass: 'bg-emerald-500/10',
    },
    {
      label: 'Converted',
      value: convertedCount,
      icon: TrendingUp,
      iconClass: 'text-teal-600',
      bgClass: 'bg-teal-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Page header */}
      <div className="border-b border-border bg-card px-5 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-foreground">Quotes</h1>
              <p className="text-[13px] text-muted-foreground">
                Create, send, and track quotes for your leads and jobs
              </p>
            </div>
          </div>
          <Link href="/quotes/new">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
              <Plus className="h-4 w-4" />
              Create Quote
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-muted-foreground">{stat.label}</span>
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', stat.bgClass)}>
                  <stat.icon className={cn('h-4 w-4', stat.iconClass)} />
                </div>
              </div>
              <div className="text-[26px] font-bold text-foreground leading-none">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Quote
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Expires
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="text-[13px] font-medium text-foreground">{quote.title}</div>
                    <div className="text-[11px] text-muted-foreground">{quote.quote_number}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-foreground">{quote.customer_name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={quote.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-[13px] font-medium tabular-nums">{formatCurrency(quote.total)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-muted-foreground">{formatDate(quote.created_at)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] text-muted-foreground">
                      {quote.expires_at ? formatDate(quote.expires_at) : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
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
        <div className="sm:hidden space-y-3">
          {quotes.map((quote) => (
            <div key={quote.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-[14px] font-semibold text-foreground">{quote.title}</div>
                  <div className="text-[12px] text-muted-foreground">{quote.quote_number}</div>
                </div>
                <StatusBadge status={quote.status} />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-muted-foreground">{quote.customer_name}</span>
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
      </div>
    </div>
  )
}
