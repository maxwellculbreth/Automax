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
import { useUpdateLead, useDeleteLead, useDashboardKPIs, useUrgentItems, useActivities, useUpcomingJobs, useJobs } from "@/hooks/use-data"
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
  CheckCircle,
  Trash2,
  Pencil,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
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
  onDelete?: () => void
}

// Format a UTC ISO string as local time for a datetime-local input.
// toISOString() always returns UTC, but datetime-local expects local time.
function toLocalDatetimeInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "lost", label: "Lost" },
] as const

export function LeadDetails({ lead, onClose, onDelete }: LeadDetailsProps) {
  const { updateLead, isUpdating } = useUpdateLead()
  const { deleteLead, isDeleting } = useDeleteLead()
  const { mutate: mutateKPIs } = useDashboardKPIs()
  const { mutate: mutateUrgent } = useUrgentItems()
  const { mutate: mutateActivities } = useActivities()
  const { mutate: mutateUpcomingJobs } = useUpcomingJobs()
  const { mutate: mutateJobs } = useJobs()
  const [currentStatus, setCurrentStatus] = useState(lead.status || "new")
  const [contactName, setContactName] = useState(lead.name || "")
  const [contactPhone, setContactPhone] = useState(lead.phone || "")
  const [contactEmail, setContactEmail] = useState(lead.email || "")
  const [contactAddress, setContactAddress] = useState(lead.address || "")
  const [service, setService] = useState(lead.service || "")
  const [source, setSource] = useState(lead.source || "")
  const [notes, setNotes] = useState(lead.notes || "")
  const [estimatedValue, setEstimatedValue] = useState(lead.estimated_value?.toString() || "")
  const [jobDate, setJobDate] = useState(
    lead.scheduled_at ? toLocalDatetimeInput(lead.scheduled_at) : ""
  )
  const [followUpDate, setFollowUpDate] = useState(
    lead.next_follow_up_at ? toLocalDatetimeInput(lead.next_follow_up_at) : ""
  )
  const [lostDate, setLostDate] = useState(
    lead.lost_at ? toLocalDatetimeInput(lead.lost_at) : ""
  )

  // Sync local state when lead prop changes (e.g., after Supabase update)
  useEffect(() => {
    setCurrentStatus(lead.status || "new")
    setContactName(lead.name || "")
    setContactPhone(lead.phone || "")
    setContactEmail(lead.email || "")
    setContactAddress(lead.address || "")
    setService(lead.service || "")
    setSource(lead.source || "")
    setNotes(lead.notes || "")
    setEstimatedValue(lead.estimated_value?.toString() || "")
    setJobDate(lead.scheduled_at ? toLocalDatetimeInput(lead.scheduled_at) : "")
    setFollowUpDate(lead.next_follow_up_at ? toLocalDatetimeInput(lead.next_follow_up_at) : "")
    setLostDate(lead.lost_at ? toLocalDatetimeInput(lead.lost_at) : "")

  }, [lead.id, lead.status, lead.name, lead.phone, lead.email, lead.address, lead.service, lead.source, lead.notes, lead.estimated_value, lead.scheduled_at, lead.next_follow_up_at, lead.lost_at])

  const handleStatusChange = async (status: Lead["status"]) => {
    setCurrentStatus(status) // optimistic — update UI immediately
    // Auto-set lost_at when marking as lost (if not already set)
    const updates: Parameters<typeof updateLead>[0]["updates"] = { status }
    if (status === "lost" && !lead.lost_at) {
      const now = new Date().toISOString()
      updates.lost_at = now
      setLostDate(toLocalDatetimeInput(now))
    }
    const result = await updateLead({ id: lead.id, updates })
    if (result) {
      mutateKPIs()
      mutateUrgent()
      mutateActivities()
      if (status === "scheduled") {
        mutateUpcomingJobs()
        mutateJobs()
      }
    } else {
      setCurrentStatus(lead.status || "new") // revert on failure
    }
  }

  const isContactDirty =
    contactName !== (lead.name || "") ||
    contactPhone !== (lead.phone || "") ||
    contactEmail !== (lead.email || "") ||
    contactAddress !== (lead.address || "")

  const handleSaveContact = async () => {
    await updateLead({
      id: lead.id,
      updates: {
        name: contactName || undefined,
        phone: contactPhone || undefined,
        email: contactEmail || null,
        address: contactAddress || null,
      },
    })
  }

  const handleSaveNotes = async () => {
    await updateLead({ id: lead.id, updates: { notes } })
  }

  const handleSaveService = async () => {
    await updateLead({ id: lead.id, updates: { service: service || undefined } })
  }

  const handleSaveSource = async () => {
    await updateLead({ id: lead.id, updates: { source: source || null } })
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

  const handleSaveJobDate = async () => {
    await updateLead({
      id: lead.id,
      updates: { scheduled_at: jobDate ? new Date(jobDate).toISOString() : null },
    })
  }

  const handleSaveFollowUp = async () => {
    await updateLead({
      id: lead.id,
      updates: { next_follow_up_at: followUpDate ? new Date(followUpDate).toISOString() : null },
    })
  }

  const handleSaveLostDate = async () => {
    await updateLead({
      id: lead.id,
      updates: { lost_at: lostDate ? new Date(lostDate).toISOString() : null },
    })
  }

  const handleDelete = async () => {
    const success = await deleteLead(lead.id)
    if (success) {
      onDelete?.()
      onClose()
    }
  }

  return (
    <div className="w-72 flex-shrink-0 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-[13px] font-semibold text-foreground">Details</h3>
        <div className="flex items-center gap-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" disabled={isDeleting}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete lead?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <span className="font-medium text-foreground">{lead.name || "this lead"}</span> and all associated data. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Contact Section */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-1.5 mb-3">
            <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Contact</h4>
            <Pencil className="h-2.5 w-2.5 text-muted-foreground/50" />
            <span className="text-[10px] text-muted-foreground/50">autosaves</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <Input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Name"
                className="h-8 text-[13px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone"
                className="h-8 text-[13px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="h-8 text-[13px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <Input
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="Address"
                className="h-8 text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* Lead Info Section */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-1.5 mb-3">
            <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Lead Info</h4>
            <Pencil className="h-2.5 w-2.5 text-muted-foreground/50" />
            <span className="text-[10px] text-muted-foreground/50">autosaves</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <Input
                value={service}
                onChange={(e) => setService(e.target.value)}
                onBlur={handleSaveService}
                placeholder="Service"
                className="h-8 text-[13px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <Input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                onBlur={handleSaveSource}
                placeholder="Source"
                className="h-8 text-[13px]"
              />
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
            <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
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
              Job Date
            </Label>
            <Input
              type="datetime-local"
              value={jobDate}
              onChange={(e) => setJobDate(e.target.value)}
              onBlur={handleSaveJobDate}
              className="h-9 text-[13px]"
            />
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

          {currentStatus === "lost" && (
            <div className="space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Lost Date
              </Label>
              <Input
                type="datetime-local"
                value={lostDate}
                onChange={(e) => setLostDate(e.target.value)}
                onBlur={handleSaveLostDate}
                className="h-9 text-[13px]"
              />
            </div>
          )}

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
          className={cn(
            "w-full h-9 text-[13px] transition-colors",
            isContactDirty
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-secondary text-muted-foreground hover:bg-secondary"
          )}
          onClick={handleSaveContact}
          disabled={isUpdating || !isContactDirty}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
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
            onClick={() => handleStatusChange("scheduled")}
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
