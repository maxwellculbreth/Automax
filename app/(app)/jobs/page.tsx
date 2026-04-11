'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CalendarCheck,
  Plus,
  Search,
  Loader2,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  PlayCircle,
  PauseCircle,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useJobs } from '@/hooks/use-data'
import { cn } from '@/lib/utils'
import type { Job } from '@/lib/data-service'

type StatusFilter = 'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  scheduled:   { label: 'Scheduled',   icon: Clock,         className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  in_progress: { label: 'In Progress', icon: PlayCircle,    className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  completed:   { label: 'Completed',   icon: CheckCircle2,  className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  cancelled:   { label: 'Cancelled',   icon: XCircle,       className: 'bg-white/5 text-white/40 border-white/10' },
  on_hold:     { label: 'On Hold',     icon: PauseCircle,   className: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTimeStr(t: string | null | undefined) {
  if (!t) return null
  const [h, min] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(min).padStart(2, '0')} ${ampm}`
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function JobCard({ job }: { job: Job }) {
  const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.scheduled
  const StatusIcon = cfg.icon
  const location = [job.property_address, job.city, job.state].filter(Boolean).join(', ')

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors p-4 sm:p-5 cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              {job.job_number && (
                <span className="text-[11px] text-muted-foreground font-mono">{job.job_number}</span>
              )}
            </div>
            <h3 className="text-[14px] font-semibold text-foreground leading-snug truncate">{job.title}</h3>
            {job.customer_name && (
              <p className="text-[12px] text-muted-foreground mt-0.5">{job.customer_name}</p>
            )}
          </div>
          <span className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium flex-shrink-0',
            cfg.className
          )}>
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
          {job.scheduled_date && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {formatDate(job.scheduled_date)}
                {job.start_time && ` · ${formatTimeStr(job.start_time)}`}
              </span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {job.quoted_amount > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Quoted</span>
            <span className="text-[14px] font-semibold text-foreground">{formatCurrency(job.quoted_amount)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'scheduled',   label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'on_hold',     label: 'On Hold' },
  { value: 'cancelled',   label: 'Cancelled' },
]

export default function JobsPage() {
  const { jobs, isLoading } = useJobs()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = jobs.filter(job => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        job.title.toLowerCase().includes(q) ||
        (job.customer_name?.toLowerCase().includes(q) ?? false) ||
        (job.service_type?.toLowerCase().includes(q) ?? false) ||
        (job.property_address?.toLowerCase().includes(q) ?? false) ||
        (job.notes?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const scheduledCount  = jobs.filter(j => j.status === 'scheduled').length
  const inProgressCount = jobs.filter(j => j.status === 'in_progress').length
  const completedCount  = jobs.filter(j => j.status === 'completed').length
  const totalRevenue    = jobs.filter(j => j.status === 'completed').reduce((s, j) => s + (j.quoted_amount ?? 0), 0)

  return (
    <div className="flex-1 flex flex-col min-h-0 pt-14 lg:pt-0">

      {/* Header */}
      <div className="border-b border-border bg-card px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[16px] font-semibold text-foreground">Jobs</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {jobs.length} total · {scheduledCount} scheduled
            </p>
          </div>
          <Link href="/jobs/new">
            <Button size="sm" className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px]">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Job</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Scheduled',   value: scheduledCount,              color: 'text-blue-400' },
            { label: 'In Progress', value: inProgressCount,             color: 'text-amber-400' },
            { label: 'Completed',   value: completedCount,              color: 'text-emerald-400' },
            { label: 'Revenue',     value: formatCurrency(totalRevenue), color: 'text-foreground' },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg bg-background border border-border px-3 py-2.5 text-center">
              <div className={cn('text-[16px] font-bold', stat.color)}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 py-3 border-b border-border bg-card/50 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search jobs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-[13px] bg-background"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors',
                statusFilter === f.value
                  ? 'bg-blue-600/15 text-blue-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job list */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-[14px] font-medium text-foreground mb-1">
              {jobs.length === 0 ? 'No jobs yet' : 'No jobs match your filter'}
            </h3>
            <p className="text-[13px] text-muted-foreground mb-5">
              {jobs.length === 0
                ? 'Book a job from a lead or create one here.'
                : 'Try adjusting your search or filter.'}
            </p>
            {jobs.length === 0 && (
              <Link href="/jobs/new">
                <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="h-3.5 w-3.5" />
                  New Job
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl">
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  )
}
