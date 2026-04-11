'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarCheck,
  Loader2,
  Clock,
  MapPin,
  User,
  Briefcase,
  DollarSign,
  AlignLeft,
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
import { useCreateJob } from '@/hooks/use-data'
import { toast } from 'sonner'

type JobStatus   = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
type JobPriority = 'low' | 'normal' | 'high' | 'urgent'

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'scheduled',   label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'on_hold',     label: 'On Hold' },
  { value: 'cancelled',   label: 'Cancelled' },
]

const PRIORITY_OPTIONS: { value: JobPriority; label: string }[] = [
  { value: 'low',    label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high',   label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export interface JobFormInitialData {
  lead_id?: string
  quote_id?: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  service_type?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  price?: number
  notes?: string
}

interface JobFormProps {
  initialData?: JobFormInitialData
}

export function JobForm({ initialData }: JobFormProps) {
  const router = useRouter()
  const { createJob, isCreating } = useCreateJob()

  const [title,         setTitle]         = useState(
    initialData?.service_type && initialData?.customer_name
      ? `${initialData.service_type} — ${initialData.customer_name}`
      : initialData?.service_type || ''
  )
  const [customerName,  setCustomerName]  = useState(initialData?.customer_name ?? '')
  const [customerPhone, setCustomerPhone] = useState(initialData?.customer_phone ?? '')
  const [customerEmail, setCustomerEmail] = useState(initialData?.customer_email ?? '')
  const [serviceType,   setServiceType]   = useState(initialData?.service_type ?? '')
  const [scheduledDate, setScheduledDate] = useState('')
  const [startTime,     setStartTime]     = useState('08:00')
  const [endTime,       setEndTime]       = useState('10:00')
  const [address,       setAddress]       = useState(initialData?.address ?? '')
  const [city,          setCity]          = useState(initialData?.city ?? '')
  const [state,         setState]         = useState(initialData?.state ?? '')
  const [zip,           setZip]           = useState(initialData?.zip ?? '')
  const [quotedAmount,  setQuotedAmount]  = useState(initialData?.price ? String(initialData.price) : '')
  const [notes,         setNotes]         = useState(initialData?.notes ?? '')
  const [status,        setStatus]        = useState<JobStatus>('scheduled')
  const [priority,      setPriority]      = useState<JobPriority>('normal')

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Job title is required')
      return
    }
    if (!initialData?.lead_id) {
      toast.error('No lead linked to this job')
      return
    }

    try {
      await createJob({
        lead_id: initialData.lead_id,
        quote_id: initialData.quote_id,
        title: title.trim(),
        service_type: serviceType || undefined,
        customer_name: customerName || undefined,
        customer_phone: customerPhone || undefined,
        customer_email: customerEmail || undefined,
        property_address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zip: zip || undefined,
        scheduled_date: scheduledDate || undefined,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        quoted_amount: quotedAmount ? Number(quotedAmount) : 0,
        notes: notes || undefined,
        status,
        priority,
      })

      toast.success('Job created')
      router.push('/jobs')
    } catch (err) {
      toast.error('Failed to create job', {
        description: err instanceof Error ? err.message : undefined,
      })
    }
  }

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
                <h1 className="text-[15px] font-semibold text-foreground">New Job</h1>
                <p className="text-[12px] text-muted-foreground">{customerName || 'Fill in job details below'}</p>
              </div>
            </div>
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px]"
              onClick={handleSave}
              disabled={isCreating}
            >
              {isCreating
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</>
                : <><CalendarCheck className="h-3.5 w-3.5" />Book Job</>
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-5 py-8 space-y-6">

        {/* Client */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Client</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Name</Label>
              <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Phone</Label>
              <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="(555) 000-0000" className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Email</Label>
              <Input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} type="email" placeholder="email@example.com" className="bg-background" />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Job Details</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Job Title <span className="text-red-400">*</span></Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Driveway Soft Wash — Johnson" className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Service Type</Label>
              <Input value={serviceType} onChange={e => setServiceType(e.target.value)} placeholder="e.g. Pressure Washing" className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Quoted Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={quotedAmount} onChange={e => setQuotedAmount(e.target.value)} placeholder="0.00" type="number" min="0" step="0.01" className="bg-background pl-8" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as JobStatus)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Priority</Label>
              <Select value={priority} onValueChange={v => setPriority(v as JobPriority)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Schedule</span>
          </div>
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
        </div>

        {/* Location */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Property / Location</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">Street Address</Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St" className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground">City</Label>
              <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Austin" className="bg-background" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">State</Label>
                <Input value={state} onChange={e => setState(e.target.value)} placeholder="TX" className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">ZIP</Label>
                <Input value={zip} onChange={e => setZip(e.target.value)} placeholder="78745" className="bg-background" />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-muted-foreground" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Visit Notes / Instructions</span>
          </div>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Gate code, access instructions, special requests…" className="min-h-[100px] bg-background resize-none text-[13px]" />
        </div>

        <div className="pb-6">
          <Button
            className="w-full sm:w-auto h-10 px-6 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            onClick={handleSave}
            disabled={isCreating}
          >
            {isCreating
              ? <><Loader2 className="h-4 w-4 animate-spin" />Creating Job…</>
              : <><CalendarCheck className="h-4 w-4" />Book Job</>
            }
          </Button>
        </div>
      </div>
    </div>
  )
}
