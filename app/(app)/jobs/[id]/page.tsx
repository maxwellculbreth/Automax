'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  Clock,
  MapPin,
  User,
  Briefcase,
  DollarSign,
  AlignLeft,
  CalendarCheck,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Job } from '@/lib/data-service'

type JobStatus   = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
type JobPriority = 'low' | 'normal' | 'high' | 'urgent'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  scheduled:   { label: 'Scheduled',   className: 'bg-blue-500/15 text-blue-400' },
  in_progress: { label: 'In Progress', className: 'bg-amber-500/15 text-amber-400' },
  completed:   { label: 'Completed',   className: 'bg-emerald-500/15 text-emerald-400' },
  cancelled:   { label: 'Cancelled',   className: 'bg-white/5 text-white/40' },
  on_hold:     { label: 'On Hold',     className: 'bg-orange-500/15 text-orange-400' },
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-white/40', normal: 'text-blue-400', high: 'text-amber-400', urgent: 'text-red-400'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTimeStr(t: string | null | undefined) {
  if (!t) return '—'
  const [h, min] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(min).padStart(2, '0')} ${ampm}`
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<Job | null | 'not-found'>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Editable fields
  const [title,        setTitle]        = useState('')
  const [status,       setStatus]       = useState<JobStatus>('scheduled')
  const [priority,     setPriority]     = useState<JobPriority>('normal')
  const [scheduledDate,setScheduledDate]= useState('')
  const [startTime,    setStartTime]    = useState('')
  const [endTime,      setEndTime]      = useState('')
  const [notes,        setNotes]        = useState('')
  const [actualAmount, setActualAmount] = useState('')
  const [paymentStatus,setPaymentStatus]= useState('unpaid')

  useEffect(() => {
    if (!id) return
    fetch(`/api/jobs/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ job: j }) => {
        setJob(j)
        setTitle(j.title ?? '')
        setStatus(j.status ?? 'scheduled')
        setPriority(j.priority ?? 'normal')
        setScheduledDate(j.scheduled_date ?? '')
        setStartTime(j.start_time ?? '')
        setEndTime(j.end_time ?? '')
        setNotes(j.notes ?? '')
        setActualAmount(j.actual_amount != null ? String(j.actual_amount) : '')
        setPaymentStatus(j.payment_status ?? 'unpaid')
      })
      .catch(() => setJob('not-found'))
  }, [id])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          status,
          priority,
          scheduled_date: scheduledDate || null,
          start_time: startTime || null,
          end_time: endTime || null,
          notes: notes || null,
          actual_amount: actualAmount ? Number(actualAmount) : null,
          payment_status: paymentStatus,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setJob(data.job)
      setIsEditing(false)
      toast.success('Job updated')
    } catch (err) {
      toast.error('Failed to save', { description: err instanceof Error ? err.message : undefined })
    } finally {
      setIsSaving(false)
    }
  }

  if (job === null) {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (job === 'not-found') {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex flex-col items-center justify-center gap-4">
        <h1 className="text-[18px] font-bold text-foreground">Job not found</h1>
        <Link href="/jobs">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.scheduled
  const location = [job.property_address, job.city, job.state, job.zip].filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* Header */}
      <div className="border-b border-border bg-card px-5 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/jobs"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-[15px] font-semibold text-foreground truncate">{job.title}</h1>
                {job.job_number && (
                  <p className="text-[12px] text-muted-foreground font-mono">{job.job_number}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-medium', statusCfg.className)}>
                {statusCfg.label}
              </span>
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" className="h-8 text-[13px]" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="h-8 gap-1.5 text-[13px] bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-[13px]" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-5 py-8 space-y-6">

        {/* Client */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Client</span>
          </div>
          <p className="text-[15px] font-semibold text-foreground">{job.customer_name || '—'}</p>
          {job.customer_phone && <p className="text-[13px] text-muted-foreground mt-0.5">{job.customer_phone}</p>}
          {job.customer_email && <p className="text-[13px] text-muted-foreground">{job.customer_email}</p>}
        </div>

        {/* Job Details */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Job Details</span>
          </div>

          {isEditing ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">Status</Label>
                <Select value={status} onValueChange={v => setStatus(v as JobStatus)}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                      <SelectItem key={v} value={v}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">Priority</Label>
                <Select value={priority} onValueChange={v => setPriority(v as JobPriority)}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['low','normal','high','urgent'] as const).map(p => (
                      <SelectItem key={p} value={p}>
                        <span className={PRIORITY_COLORS[p]}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <span className="text-muted-foreground">Service</span>
                <p className="font-medium text-foreground mt-0.5">{job.service_type || '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Priority</span>
                <p className={cn('font-medium mt-0.5', PRIORITY_COLORS[job.priority] ?? 'text-foreground')}>
                  {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Schedule</span>
          </div>
          {isEditing ? (
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">Date</Label>
                <Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">Start Time</Label>
                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">End Time</Label>
                <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-background" />
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-[13px]">
              <p className="font-medium text-foreground">{formatDate(job.scheduled_date)}</p>
              {(job.start_time || job.end_time) && (
                <p className="text-muted-foreground">
                  {formatTimeStr(job.start_time)}{job.end_time ? ` – ${formatTimeStr(job.end_time)}` : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Location */}
        {(location || isEditing) && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Location</span>
            </div>
            <p className="text-[13px] text-foreground">{location || '—'}</p>
          </div>
        )}

        {/* Financials */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Financials</span>
          </div>
          {isEditing ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">Actual Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={actualAmount} onChange={e => setActualAmount(e.target.value)} type="number" min="0" step="0.01" className="bg-background pl-8" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <span className="text-muted-foreground">Quoted</span>
                <p className="font-semibold text-foreground mt-0.5">{formatCurrency(job.quoted_amount)}</p>
              </div>
              {job.actual_amount != null && (
                <div>
                  <span className="text-muted-foreground">Actual</span>
                  <p className="font-semibold text-foreground mt-0.5">{formatCurrency(job.actual_amount)}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Payment</span>
                <p className={cn('font-medium mt-0.5 capitalize',
                  job.payment_status === 'paid' ? 'text-emerald-400'
                  : job.payment_status === 'partial' ? 'text-amber-400'
                  : 'text-white/40'
                )}>
                  {job.payment_status}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</span>
          </div>
          {isEditing ? (
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Visit instructions, notes…" className="min-h-[100px] bg-background resize-none text-[13px]" />
          ) : (
            <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-wrap">{job.notes || '—'}</p>
          )}
        </div>

        {isEditing && (
          <div className="pb-6">
            <Button className="w-full sm:w-auto h-10 px-6 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4" />Save Changes</>}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
