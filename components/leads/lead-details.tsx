"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  type Lead,
  formatCurrency,
  formatRelativeTime,
} from "@/lib/data-service"
import {
  useUpdateLead,
  useDeleteLead,
  useDashboardKPIs,
  useUrgentItems,
  useActivities,
  useUpcomingJobs,
  useJobs,
  useJobByLead,
  useQuoteByLead,
  useCreateMessage,
} from "@/hooks/use-data"
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
  CalendarCheck,
  Star,
  AlertCircle,
  ExternalLink,
  RotateCcw,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Format UTC ISO → local datetime-local string (for follow-up + lost date inputs only)
function toLocalDatetimeInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const statusOptions = [
  { value: "new",       label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted",    label: "Quoted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "lost",      label: "Lost" },
] as const

interface LeadDetailsProps {
  lead: Lead
  onClose: () => void
  onDelete?: () => void
}

export function LeadDetails({ lead, onClose, onDelete }: LeadDetailsProps) {
  const router = useRouter()
  const { updateLead, isUpdating } = useUpdateLead()
  const { deleteLead, isDeleting } = useDeleteLead()
  const { mutate: mutateKPIs }         = useDashboardKPIs()
  const { mutate: mutateUrgent }       = useUrgentItems()
  const { mutate: mutateActivities }   = useActivities()
  const { mutate: mutateUpcomingJobs } = useUpcomingJobs()
  const { mutate: mutateJobs }         = useJobs()
  const { createMessage }              = useCreateMessage()

  // Pre-fetch linked quote + job for this lead
  const { quote, isLoading: quoteLoading } = useQuoteByLead(lead.id)
  const { job,   isLoading: jobLoading }   = useJobByLead(lead.id)

  const [currentStatus, setCurrentStatus] = useState(lead.status || "new")
  const [contactName,   setContactName]   = useState(lead.name || "")
  const [contactPhone,  setContactPhone]  = useState(lead.phone || "")
  const [contactEmail,  setContactEmail]  = useState(lead.email || "")
  const [contactAddress,setContactAddress]= useState(lead.address || "")
  const [service,       setService]       = useState(lead.service || "")
  const [source,        setSource]        = useState(lead.source || "")
  const [notes,         setNotes]         = useState(lead.notes || "")
  const [estimatedValue,setEstimatedValue]= useState(lead.estimated_value?.toString() || "")
  const [followUpDate,  setFollowUpDate]  = useState(
    lead.next_follow_up_at ? toLocalDatetimeInput(lead.next_follow_up_at) : ""
  )
  const [lostDate, setLostDate] = useState(
    lead.lost_at ? toLocalDatetimeInput(lead.lost_at) : ""
  )

  // Review request dialog
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [isSendingReview, setIsSendingReview] = useState(false)

  // "No quote" / "No job" inline alert state
  const [showNoQuoteNote, setShowNoQuoteNote] = useState(false)
  const [showNoJobNote,   setShowNoJobNote]   = useState(false)

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
    setFollowUpDate(lead.next_follow_up_at ? toLocalDatetimeInput(lead.next_follow_up_at) : "")
    setLostDate(lead.lost_at ? toLocalDatetimeInput(lead.lost_at) : "")
  }, [lead.id, lead.status, lead.name, lead.phone, lead.email, lead.address, lead.service, lead.source, lead.notes, lead.estimated_value, lead.next_follow_up_at, lead.lost_at])

  const handleStatusChange = async (status: Lead["status"]) => {
    setCurrentStatus(status)
    const updates: Parameters<typeof updateLead>[0]["updates"] = { status }
    if (status === "lost" && !lead.lost_at) {
      const now = new Date().toISOString()
      updates.lost_at = now
      setLostDate(toLocalDatetimeInput(now))
    }
    const result = await updateLead({ id: lead.id, updates })
    if (result) {
      mutateKPIs(); mutateUrgent(); mutateActivities()
      if (status === "scheduled") { mutateUpcomingJobs(); mutateJobs() }
    } else {
      setCurrentStatus(lead.status || "new")
    }
  }

  const isContactDirty =
    contactName    !== (lead.name    || "") ||
    contactPhone   !== (lead.phone   || "") ||
    contactEmail   !== (lead.email   || "") ||
    contactAddress !== (lead.address || "")

  const handleSaveContact = async () => {
    await updateLead({
      id: lead.id,
      updates: {
        name:    contactName    || undefined,
        phone:   contactPhone   || undefined,
        email:   contactEmail   || null,
        address: contactAddress || null,
      },
    })
  }

  const handleSaveNotes   = async () => updateLead({ id: lead.id, updates: { notes } })
  const handleSaveService = async () => updateLead({ id: lead.id, updates: { service: service || undefined } })
  const handleSaveSource  = async () => updateLead({ id: lead.id, updates: { source: source || null } })
  const handleSaveValue   = async () => {
    const value = parseFloat(estimatedValue)
    if (!isNaN(value)) {
      const result = await updateLead({ id: lead.id, updates: { estimated_value: value } })
      if (result) { mutateKPIs(); mutateActivities() }
    }
  }
  const handleSaveFollowUp = async () => {
    await updateLead({ id: lead.id, updates: { next_follow_up_at: followUpDate ? new Date(followUpDate).toISOString() : null } })
  }
  const handleSaveLostDate = async () => {
    await updateLead({ id: lead.id, updates: { lost_at: lostDate ? new Date(lostDate).toISOString() : null } })
  }

  const handleDelete = async () => {
    const success = await deleteLead(lead.id)
    if (success) { onDelete?.(); onClose() }
  }

  // ── Routing helpers ──────────────────────────────────────────────────────────

  const openSendQuote = () => {
    const p = new URLSearchParams()
    p.set("lead_id", lead.id)
    if (lead.name)    p.set("customer_name",  lead.name)
    if (lead.phone)   p.set("customer_phone", lead.phone)
    if (lead.email)   p.set("customer_email", lead.email)
    if (lead.address) p.set("property_address", lead.address)
    router.push(`/quotes/new?${p.toString()}`)
  }

  const openBookJob = () => {
    const p = new URLSearchParams()
    p.set("lead_id", lead.id)
    if (lead.name)            p.set("customer_name", lead.name)
    if (lead.phone)           p.set("customer_phone", lead.phone)
    if (lead.email)           p.set("customer_email", lead.email)
    if (lead.address)         p.set("address", lead.address)
    if (lead.service)         p.set("service_type", lead.service)
    if (lead.estimated_value) p.set("price", String(lead.estimated_value))
    router.push(`/jobs/new?${p.toString()}`)
  }

  const handleViewQuote = () => {
    setShowNoQuoteNote(false)
    if (quote?.id) {
      router.push(`/quotes/${quote.id}/edit`)
    } else {
      setShowNoQuoteNote(true)
    }
  }

  const handleViewJob = () => {
    setShowNoJobNote(false)
    if (job?.id) {
      router.push(`/jobs/${job.id}`)
    } else {
      setShowNoJobNote(true)
    }
  }

  const openReviewDialog = () => {
    const firstName = (lead.name || "there").split(" ")[0]
    const service   = lead.service ? lead.service.toLowerCase() : "the work"
    setReviewText(
      `Hi ${firstName}! Hope you're enjoying the results. If you have a moment, we'd really appreciate a quick Google review — it helps us continue serving customers like you.\n\nThank you for choosing us!`
    )
    setReviewDialogOpen(true)
  }

  const sendReviewRequest = async () => {
    if (!lead.phone) return
    setIsSendingReview(true)
    try {
      await createMessage({
        lead_id:     lead.id,
        company_id:  lead.business_id,
        content:     reviewText,
        sender_type: "business",
        channel:     "sms",
      })
      setReviewDialogOpen(false)
    } finally {
      setIsSendingReview(false)
    }
  }

  // ── Scheduled job summary (read-only) ────────────────────────────────────────

  function formatJobDate(d: string | null | undefined) {
    if (!d) return null
    const [y, m, day] = d.split("-").map(Number)
    return new Date(y, m - 1, day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  function formatJobTime(t: string | null | undefined) {
    if (!t) return null
    const [h, min] = t.split(":").map(Number)
    return `${h % 12 || 12}:${String(min).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
  }

  // ── Status-aware footer action buttons ───────────────────────────────────────

  const renderFooterActions = () => {
    const status = currentStatus

    if (status === "new" || status === "contacted") {
      return (
        <>
          <Button
            className="w-full h-9 text-[13px] bg-blue-600 hover:bg-blue-700 text-white"
            onClick={openSendQuote}
          >
            <FileText className="h-4 w-4 mr-2" />
            Send Quote
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="h-8 text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={openBookJob}
            >
              <CalendarCheck className="h-3.5 w-3.5 mr-1" />
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
        </>
      )
    }

    if (status === "quoted") {
      return (
        <>
          <Button
            className="w-full h-9 text-[13px] bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleViewQuote}
            disabled={quoteLoading}
          >
            {quoteLoading
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <FileText className="h-4 w-4 mr-2" />
            }
            View Quote
          </Button>
          {showNoQuoteNote && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-400">
              No quote found for this lead yet.
              <button className="underline ml-1" onClick={() => { setShowNoQuoteNote(false); openSendQuote() }}>
                Create one →
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="h-8 text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={openBookJob}
            >
              <CalendarCheck className="h-3.5 w-3.5 mr-1" />
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
        </>
      )
    }

    if (status === "scheduled") {
      return (
        <>
          {job && !jobLoading && (
            <div className="rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] space-y-0.5">
              <div className="text-muted-foreground font-medium uppercase tracking-wide text-[10px] mb-1">Scheduled Job</div>
              <p className="font-semibold text-foreground text-[13px]">{job.title}</p>
              {job.scheduled_date && (
                <p className="text-muted-foreground">
                  {formatJobDate(job.scheduled_date)}
                  {job.start_time && ` · ${formatJobTime(job.start_time)}`}
                </p>
              )}
            </div>
          )}
          <Button
            className="w-full h-9 text-[13px] bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleViewJob}
            disabled={jobLoading}
          >
            {jobLoading
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <CalendarCheck className="h-4 w-4 mr-2" />
            }
            View Job
          </Button>
          {showNoJobNote && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-400">
              No active job found for this lead.
              <button className="underline ml-1" onClick={() => { setShowNoJobNote(false); openBookJob() }}>
                Create one →
              </button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-[12px] text-destructive hover:text-destructive"
            onClick={() => handleStatusChange("lost")}
            disabled={isUpdating}
          >
            Mark Lost
          </Button>
        </>
      )
    }

    if (status === "completed") {
      return (
        <>
          <Button
            className="w-full h-9 text-[13px] bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            onClick={openReviewDialog}
          >
            <Star className="h-4 w-4 mr-2" />
            Request Review
          </Button>
          {job && (
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-[12px] text-muted-foreground"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              View Job Details
            </Button>
          )}
        </>
      )
    }

    if (status === "lost") {
      return (
        <Button
          variant="outline"
          className="w-full h-9 text-[13px]"
          onClick={() => handleStatusChange("contacted")}
          disabled={isUpdating}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reactivate Lead
        </Button>
      )
    }

    return null
  }

  return (
    <>
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
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
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
          {/* Contact */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-1.5 mb-3">
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Contact</h4>
              <Pencil className="h-2.5 w-2.5 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground/50">autosaves</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <Input value={contactName} onChange={e => setContactName(e.target.value)} onBlur={isContactDirty ? handleSaveContact : undefined} placeholder="Name" className="h-8 text-[13px]" />
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <Input value={contactPhone} onChange={e => setContactPhone(e.target.value)} onBlur={isContactDirty ? handleSaveContact : undefined} placeholder="Phone" className="h-8 text-[13px]" />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <Input value={contactEmail} onChange={e => setContactEmail(e.target.value)} onBlur={isContactDirty ? handleSaveContact : undefined} placeholder="Email" type="email" className="h-8 text-[13px]" />
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <Input value={contactAddress} onChange={e => setContactAddress(e.target.value)} onBlur={isContactDirty ? handleSaveContact : undefined} placeholder="Address" className="h-8 text-[13px]" />
              </div>
            </div>
          </div>

          {/* Lead Info */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-1.5 mb-3">
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Lead Info</h4>
              <Pencil className="h-2.5 w-2.5 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground/50">autosaves</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <Input value={service} onChange={e => setService(e.target.value)} onBlur={handleSaveService} placeholder="Service" className="h-8 text-[13px]" />
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <Input value={source} onChange={e => setSource(e.target.value)} onBlur={handleSaveSource} placeholder="Source" className="h-8 text-[13px]" />
              </div>
              {lead.property_type && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[12px] text-muted-foreground"><Home className="h-3.5 w-3.5" />Property</span>
                  <span className="text-[13px] font-medium text-foreground capitalize">{lead.property_type}</span>
                </div>
              )}
              {lead.sqft && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[12px] text-muted-foreground"><MapPin className="h-3.5 w-3.5" />Size</span>
                  <span className="text-[13px] font-medium text-foreground">{lead.sqft.toLocaleString()} sq ft</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px] text-muted-foreground"><Calendar className="h-3.5 w-3.5" />Created</span>
                <span className="text-[13px] text-foreground">{formatRelativeTime(lead.created_at)}</span>
              </div>
              {lead.last_contact_at && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[12px] text-muted-foreground"><Clock className="h-3.5 w-3.5" />Last Contact</span>
                  <span className="text-[13px] text-foreground">{formatRelativeTime(lead.last_contact_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Editable fields */}
          <div className="px-4 py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Status</Label>
              <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(o => (
                    <SelectItem key={o.value} value={o.value} className="text-[13px]">{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Quote Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input type="number" value={estimatedValue} onChange={e => setEstimatedValue(e.target.value)} onBlur={handleSaveValue} className="h-9 pl-8 text-[13px]" />
              </div>
            </div>

            {/* Read-only scheduled job info (when scheduled) */}
            {currentStatus === "scheduled" && lead.scheduled_at && !job && (
              <div className="space-y-1">
                <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Scheduled At</Label>
                <p className="text-[13px] text-muted-foreground">
                  {new Date(lead.scheduled_at).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </p>
                <p className="text-[11px] text-muted-foreground/60">Edit via Job Details</p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Follow-Up Date</Label>
              <Input type="datetime-local" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} onBlur={handleSaveFollowUp} className="h-9 text-[13px]" />
            </div>

            {currentStatus === "lost" && (
              <div className="space-y-2">
                <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Lost Date</Label>
                <Input type="datetime-local" value={lostDate} onChange={e => setLostDate(e.target.value)} onBlur={handleSaveLostDate} className="h-9 text-[13px]" />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Notes</Label>
              <Textarea placeholder="Add notes..." value={notes} onChange={e => setNotes(e.target.value)} onBlur={handleSaveNotes} className="min-h-[80px] text-[13px] resize-none" />
            </div>
          </div>
        </div>

        {/* Footer — status-aware actions */}
        <div className="p-4 border-t border-border space-y-2">
          {isContactDirty && (
            <Button
              className="w-full h-9 text-[13px] bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSaveContact}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          )}
          {renderFooterActions()}
        </div>
      </div>

      {/* Review Request Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Review</DialogTitle>
            <DialogDescription>
              Send a review request to {lead.name || "this customer"} via SMS. Edit the message before sending.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              className="min-h-[140px] text-[13px] resize-none bg-background"
            />
            {!lead.phone && (
              <p className="text-[12px] text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                No phone number on file — add one first.
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5"
              onClick={sendReviewRequest}
              disabled={!lead.phone || isSendingReview || !reviewText.trim()}
            >
              {isSendingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
              Send via SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
