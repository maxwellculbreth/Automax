'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

const SOURCE_OPTIONS = [
  'Google', 'Facebook', 'Instagram', 'Referral', 'Yelp',
  'Door Hanger', 'Yard Sign', 'Repeat Customer', 'Other',
]

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Active' },
  { value: 'vip',      label: 'VIP' },
  { value: 'inactive', label: 'Inactive' },
]

export function AddClientDialog({ open, onOpenChange, onCreated }: Props) {
  const [fullName,  setFullName]  = useState('')
  const [phone,     setPhone]     = useState('')
  const [email,     setEmail]     = useState('')
  const [address,   setAddress]   = useState('')
  const [status,    setStatus]    = useState('active')
  const [source,    setSource]    = useState('')
  const [notes,     setNotes]     = useState('')
  const [isSaving,  setIsSaving]  = useState(false)
  const [error,     setError]     = useState('')

  function reset() {
    setFullName(''); setPhone(''); setEmail(''); setAddress('')
    setStatus('active'); setSource(''); setNotes(''); setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim()) { setError('Name is required'); return }
    setIsSaving(true)
    setError('')
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, phone, email, address, status, source, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create client')
      toast.success('Client added')
      reset()
      onOpenChange(false)
      onCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-bold">New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-[12px] font-medium">Full Name <span className="text-red-500">*</span></Label>
            <Input
              className="h-9 text-[13px]"
              placeholder="John Smith"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Phone</Label>
              <Input className="h-9 text-[13px]" placeholder="(555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Email</Label>
              <Input type="email" className="h-9 text-[13px]" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] font-medium">Address</Label>
            <Input className="h-9 text-[13px]" placeholder="123 Main St, City, State" value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Status</Label>
              <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Source</Label>
              <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={source}
                onChange={e => setSource(e.target.value)}
              >
                <option value="">— Select —</option>
                {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] font-medium">Notes</Label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Optional notes…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {error && <p className="text-[12px] text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" className="h-8 text-[13px]" onClick={() => { reset(); onOpenChange(false) }}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-[13px]" disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving…</> : 'Add Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
