"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  type Lead,
  formatCurrency,
  formatRelativeTime,
} from "@/lib/data-service"
import { useUpdateLead, useDashboardKPIs, useUrgentItems, useActivities, useUpcomingJobs, useJobs } from "@/hooks/use-data"
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Tag,
  FileText,
  User,
  Home,
  Loader2,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LeadDetailsProps {
  lead: Lead
  onClose: () => void
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
] as const

export function LeadDetails({ lead, onClose }: LeadDetailsProps) {
  const { updateLead, isUpdating } = useUpdateLead()
  const { mutate: mutateKPIs } = useDashboardKPIs()
  const { mutate: mutateUrgent } = useUrgentItems()
  const { mutate: mutateActivities } = useActivities()
  const { mutate: mutateUpcomingJobs } = useUpcomingJobs()
  const { mutate: mutateJobs } = useJobs()
  const [notes, setNotes] = useState(lead.notes || "")
  const [estimatedValue, setEstimatedValue] = useState(lead.estimated_value?.toString() || "")
  const [followUpDate, setFollowUpDate] = useState(
    lead.next_follow_up_at
      ? new Date(lead.next_follow_up_at).toISOString().slice(0, 16)
      : ""
  )

  // Sync local state when lead prop changes (e.g., after Supabase update)
  useEffect(() => {
    setNotes(lead.notes || "")
    setEstimatedValue(lead.estimated_value?.toString() || "")
    setFollowUpDate(
      lead.next_follow_up_at
        ? new Date(lead.next_follow_up_at).toISOString().slice(0, 16)
        : ""
    )
  }, [lead.id, lead.notes, lead.estimated_value, lead.next_follow_up_at])

  const handleStatusChange = async (status: Lead["status"]) => {
    const result = await updateLead({ id: lead.id, updates: { status } })
    if (result) {
      // Revalidate dashboard data after status change
      mutateKPIs()
      mutateUrgent()
      mutateActivities()
      
      // If booked, also revalidate jobs/schedule
      if (status === "booked") {
        mutateUpcomingJobs()
        mutateJobs()
      }
    }
  }

  const handleSaveNotes = async () => {
    await updateLead({ id: lead.id, updates: { notes } })
  }

  const handleSaveValue = async () => {
    const value = parseFloat(estimatedValue)
    if (!isNaN(value)) {
      const result = await updateLead({ id: lead.id, updates: { estimated_value: value } })
      if (result) {
        mutateKPIs()
        mutateActivities()
      }
    }
  }

  const handleSaveFollowUp = async () => {
    await updateLead({
      id: lead.id,
      updates: { next_follow_up_at: followUpDate ? new Date(followUpDate).toISOString() : null },
    })
  }

  return (
    <div className="w-72 flex-shrink-0 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-[13px] font-semibold text-foreground">Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Contact Section */}
        <div className="px-4 py-4 border-b border-border">
          <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Contact
          </h4>
          <div className="space-y-2.5">
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-2.5 text-[13px] text-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              {lead.phone}
            </a>
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-2.5 text-[13px] text-foreground hover:text-primary transition-colors truncate"
              >
                <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </a>
            )}
            {lead.address && (
              <div className="flex items-start gap-2.5 text-[13px] text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span>{lead.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lead Info Section */}
        <div className="px-4 py-4 border-b border-border">
          <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Lead Info
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                Service
              </span>
              <span className="text-[13px] font-medium text-foreground">{lead.service || "Not specified"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Source
              </span>
              <span className="text-[13px] font-medium text-foreground">{lead.source || "-"}</span>
            </div>
            {lead.property_type && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Home className="h-3.5 w-3.5" />
                  Property
                </span>
                <span className="text-[13px] font-medium text-foreground capitalize">
                  {lead.property_type}
                </span>
              </div>
            )}
            {lead.sqft && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Size
                </span>
                <span className="text-[13px] font-medium text-foreground">
                  {lead.sqft.toLocaleString()} sq ft
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Created
              </span>
              <span className="text-[13px] text-foreground">{formatRelativeTime(lead.created_at)}</span>
            </div>
            {lead.last_contact_at && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Last Contact
                </span>
                <span className="text-[13px] text-foreground">
                  {formatRelativeTime(lead.last_contact_at)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Editable Fields */}
        <div className="px-4 py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </Label>
            <Select value={lead.status || "new"} onValueChange={handleStatusChange} disabled={isUpdating}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[13px]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Quote Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                onBlur={handleSaveValue}
                className="h-9 pl-8 text-[13px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Follow-Up Date
            </Label>
            <Input
              type="datetime-local"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              onBlur={handleSaveFollowUp}
              className="h-9 text-[13px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Notes
            </Label>
            <Textarea
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              className="min-h-[80px] text-[13px] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button 
          className="w-full h-9 text-[13px]" 
          onClick={() => handleStatusChange("quoted")}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Create Quote
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[12px]"
            onClick={() => handleStatusChange("booked")}
            disabled={isUpdating}
          >
            Book Job
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[12px] text-destructive hover:text-destructive"
            onClick={() => handleStatusChange("lost")}
            disabled={isUpdating}
          >
            Mark Lost
          </Button>
        </div>
      </div>
    </div>
  )
}
