"use client"

import { useState, useMemo } from "react"
import {
  Star,
  Link2,
  Clock,
  MessageSquare,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock3,
  Loader2,
  Send,
  Phone,
  ArrowRight,
  ExternalLink,
  Plug,
  Copy,
  CheckCheck,
  Shield,
  CircleDot,
} from "lucide-react"
import { useLeads } from "@/hooks/use-data"
import { normalizeStatus } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ReviewSettings {
  enabled: boolean
  reviewLink: string
  sendDelayMinutes: number
  autoRequest: boolean
  template: string
}

type RequestStatus = "sent" | "pending" | "scheduled" | "canceled" | "failed"

interface ReviewRequest {
  id: string
  name: string
  phone: string
  status: RequestStatus
  scheduledFor: string
  sentAt: string | null
  preview: string
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_TEMPLATE =
  "Hey {{customer_name}}, thanks again for choosing us! If you don't mind, would you leave us a quick review? It really helps: {{review_link}}"

// Demo rows — replaced by real data when SMS delivery is wired up
const DEMO_REQUESTS: ReviewRequest[] = [
  {
    id: "d1",
    name: "Sarah Johnson",
    phone: "(512) 555-0121",
    status: "sent",
    scheduledFor: new Date(Date.now() - 2 * 86_400_000 - 30 * 60_000).toISOString(),
    sentAt:        new Date(Date.now() - 2 * 86_400_000).toISOString(),
    preview:       "Hey Sarah, thanks again for choosing us! If you don't mind...",
  },
  {
    id: "d2",
    name: "Marcus Webb",
    phone: "(512) 555-0187",
    status: "pending",
    scheduledFor: new Date(Date.now() + 28 * 60_000).toISOString(),
    sentAt:        null,
    preview:       "Hey Marcus, thanks again for choosing us! If you don't mind...",
  },
  {
    id: "d3",
    name: "David Park",
    phone: "(512) 555-0134",
    status: "scheduled",
    scheduledFor: new Date(Date.now() + 86_400_000).toISOString(),
    sentAt:        null,
    preview:       "Hey David, thanks again for choosing us! If you don't mind...",
  },
  {
    id: "d4",
    name: "Lisa Chen",
    phone: "(512) 555-0156",
    status: "sent",
    scheduledFor: new Date(Date.now() - 5 * 86_400_000 - 30 * 60_000).toISOString(),
    sentAt:        new Date(Date.now() - 5 * 86_400_000).toISOString(),
    preview:       "Hey Lisa, thanks again for choosing us! If you don't mind...",
  },
  {
    id: "d5",
    name: "Tom Rodriguez",
    phone: "(512) 555-0199",
    status: "canceled",
    scheduledFor: new Date(Date.now() - 86_400_000).toISOString(),
    sentAt:        null,
    preview:       "Hey Tom, thanks again for choosing us! If you don't mind...",
  },
]

const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string; icon: React.ElementType }> = {
  sent:      { label: "Sent",      icon: CheckCheck, className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  pending:   { label: "Pending",   icon: Clock3,     className: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" },
  scheduled: { label: "Scheduled", icon: Clock,      className: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20" },
  canceled:  { label: "Canceled",  icon: XCircle,    className: "text-muted-foreground bg-secondary/60 border-border/60" },
  failed:    { label: "Failed",    icon: AlertCircle, className: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20" },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffMin = Math.round(diffMs / 60_000)

  if (diffMin > 0 && diffMin < 60) return `in ${diffMin}m`
  if (diffMin > 0 && diffMin < 1440) return `in ${Math.round(diffMin / 60)}h`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const { leads } = useLeads()

  const [settings, setSettings] = useState<ReviewSettings>({
    enabled:            false,
    reviewLink:         "",
    sendDelayMinutes:   30,
    autoRequest:        true,
    template:           DEFAULT_TEMPLATE,
  })
  const [isDirty,    setIsDirty]    = useState(false)
  const [isSaving,   setIsSaving]   = useState(false)
  const [savedOnce,  setSavedOnce]  = useState(false)
  const [copied,     setCopied]     = useState(false)
  // Track per-lead send state: "idle" | "sending" | "sent" | "error"
  const [sendState, setSendState]   = useState<Record<string, "idle" | "sending" | "sent" | "error">>( {})

  // TODO: derive from company plan — const isPro = ["pro", "max"].includes(company?.plan ?? "")
  const isPro = true

  // Eligible leads: completed + has phone number
  const eligibleLeads = useMemo(
    () => leads.filter(l => normalizeStatus(l.status) === "completed" && !!l.phone),
    [leads]
  )

  const isFullyEnabled = settings.enabled && !!settings.reviewLink.trim() && savedOnce

  const previewMessage = settings.template
    .replace(/\{\{customer_name\}\}/g, "John Smith")
    .replace(/\{\{review_link\}\}/g, settings.reviewLink.trim() || "https://g.page/r/your-business")

  const updateSetting = <K extends keyof ReviewSettings>(key: K, value: ReviewSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    if (settings.enabled && !settings.reviewLink.trim()) {
      toast.error("Add your Google review link before enabling automation")
      return
    }
    setIsSaving(true)
    // TODO: persist to Supabase
    // await supabase.from("companies").update({
    //   reviews_enabled:            settings.enabled,
    //   review_link:                settings.reviewLink,
    //   review_send_delay_minutes:  settings.sendDelayMinutes,
    //   review_auto_request:        settings.autoRequest,
    //   review_template:            settings.template,
    // }).eq("id", company.id)
    await new Promise(r => setTimeout(r, 600))
    setIsSaving(false)
    setIsDirty(false)
    setSavedOnce(true)
    toast.success("Review settings saved")
  }

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Send a review request SMS to a specific lead.
  // Builds the message from the current template, substituting the lead's name
  // and the saved review link. Calls the now-fixed /api/sms/send endpoint.
  const handleSendReviewRequest = async (lead: { id: string; name: string; phone: string }) => {
    if (!settings.reviewLink.trim()) {
      toast.error("Add your Google review link in settings before sending")
      return
    }

    const message = settings.template
      .replace(/\{\{customer_name\}\}/g, lead.name.split(" ")[0] || lead.name)
      .replace(/\{\{review_link\}\}/g, settings.reviewLink.trim())

    setSendState(prev => ({ ...prev, [lead.id]: "sending" }))

    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, content: message }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? "Send failed")
      }

      setSendState(prev => ({ ...prev, [lead.id]: "sent" }))
      toast.success(
        data.mock
          ? `Review request queued for ${lead.name} (mock — Twilio not configured)`
          : `Review request sent to ${lead.name}`
      )
    } catch (err) {
      setSendState(prev => ({ ...prev, [lead.id]: "error" }))
      toast.error(err instanceof Error ? err.message : "Failed to send review request")
    }
  }

  const pendingCount = DEMO_REQUESTS.filter(r => r.status === "pending" || r.status === "scheduled").length
  const sentCount    = DEMO_REQUESTS.filter(r => r.status === "sent").length

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* ── Header ── */}
      <header className="border-b border-border bg-card px-5 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-semibold text-foreground tracking-tight">Reviews</h1>
                <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wide shadow-sm">
                  Pro
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                Automatically request Google reviews after completed jobs
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground/60">
                Turn completed jobs into more 5-star reviews with automated follow-up.
              </p>
            </div>
          </div>

          {/* Automation status pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5 self-start sm:self-auto flex-shrink-0">
            <div className={cn(
              "h-1.5 w-1.5 rounded-full",
              isFullyEnabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
            )} />
            <span className="text-[11px] font-medium text-muted-foreground">
              {isFullyEnabled ? "Automation Active" : "Automation Off"}
            </span>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* ── Pro gate banner ── */}
        {!isPro && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-foreground">Upgrade to Pro to use Reviews</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Review automation is available on the Pro plan ($79/mo). Settings are locked until you upgrade.
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white flex-shrink-0">
              Upgrade to Pro
            </Button>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <ReviewStatCard
            label="Automation Status"
            value={isFullyEnabled ? "Active" : "Inactive"}
            sub={isFullyEnabled ? "Sending review requests" : settings.reviewLink ? "Save settings to activate" : "Add review link to activate"}
            accent={isFullyEnabled ? "green" : "gray"}
          />
          <ReviewStatCard
            label="Eligible Leads"
            value={String(eligibleLeads.length)}
            sub="Completed with phone number"
            accent="blue"
          />
          <ReviewStatCard
            label="Pending Requests"
            value={isFullyEnabled ? String(pendingCount) : "—"}
            sub={isFullyEnabled ? `${pendingCount} awaiting delivery` : "Enable automation to track"}
            accent="amber"
            demo={isFullyEnabled}
          />
          <ReviewStatCard
            label="Requests Sent"
            value={isFullyEnabled ? String(sentCount) : "—"}
            sub={isFullyEnabled ? "Across all time" : "Enable automation to track"}
            accent="emerald"
            demo={isFullyEnabled}
          />
        </div>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* LEFT column */}
          <div className="space-y-5">

            {/* A. Automation Settings */}
            <div className={cn("rounded-xl border border-border bg-card", !isPro && "opacity-60 pointer-events-none")}>
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-[13px] font-semibold text-foreground">Review Automation Settings</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">Configure when and how review requests are sent</p>
              </div>

              <div className="p-5 space-y-5">

                {/* Master toggle */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="automation-toggle" className="text-[13px] font-medium cursor-pointer">
                      Enable Review Automation
                    </Label>
                    <p className="text-[12px] text-muted-foreground">
                      {settings.reviewLink.trim()
                        ? "Turn on to start sending review requests automatically"
                        : "Add your Google review link below first"
                      }
                    </p>
                  </div>
                  <Switch
                    id="automation-toggle"
                    checked={settings.enabled}
                    onCheckedChange={v => updateSetting("enabled", v)}
                    disabled={!settings.reviewLink.trim()}
                  />
                </div>

                <div className="border-t border-border/60" />

                {/* Google review link */}
                <div className="space-y-2">
                  <Label htmlFor="review-link" className="text-[13px] font-medium flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Google Review Link
                    <span className="text-red-500 text-[11px]">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="review-link"
                      placeholder="https://g.page/r/your-business/review"
                      value={settings.reviewLink}
                      onChange={e => updateSetting("reviewLink", e.target.value)}
                      className="text-[13px] pr-10"
                    />
                    {settings.reviewLink && (
                      <a
                        href={settings.reviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {!settings.reviewLink.trim() && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Required to enable automation
                    </p>
                  )}
                  {settings.reviewLink.trim() && !settings.reviewLink.startsWith("http") && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Link should start with https://
                    </p>
                  )}
                </div>

                <div className="border-t border-border/60" />

                {/* Send delay */}
                <div className="space-y-2">
                  <Label htmlFor="send-delay" className="text-[13px] font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    Send Delay
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="send-delay"
                      type="number"
                      min={5}
                      max={1440}
                      value={settings.sendDelayMinutes}
                      onChange={e => updateSetting("sendDelayMinutes", Math.max(5, parseInt(e.target.value) || 30))}
                      className="text-[13px] w-24"
                    />
                    <span className="text-[13px] text-muted-foreground">minutes after job is completed</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/70">
                    Default is 30 minutes. Recommended: 30–120 minutes while the experience is fresh.
                  </p>
                </div>

                <div className="border-t border-border/60" />

                {/* Auto-request toggle */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-request" className="text-[13px] font-medium cursor-pointer">
                      Auto-request when marked completed
                    </Label>
                    <p className="text-[12px] text-muted-foreground">
                      Automatically queue a request when a lead's status changes to Completed
                    </p>
                  </div>
                  <Switch
                    id="auto-request"
                    checked={settings.autoRequest}
                    onCheckedChange={v => updateSetting("autoRequest", v)}
                  />
                </div>

                {/* Save button */}
                <div className="flex items-center justify-between pt-1">
                  {isDirty && (
                    <p className="text-[11px] text-muted-foreground/60">Unsaved changes</p>
                  )}
                  <Button
                    size="sm"
                    className="ml-auto h-8 text-[13px]"
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                  >
                    {isSaving ? (
                      <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving…</>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* B. Message Template */}
            <div className={cn("rounded-xl border border-border bg-card", !isPro && "opacity-60 pointer-events-none")}>
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-[13px] font-semibold text-foreground">Message Template</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">Customize the message your customers will receive</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Template editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[13px] font-medium">Template</Label>
                    <button
                      onClick={() => { updateSetting("template", DEFAULT_TEMPLATE); toast.success("Template reset") }}
                      className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Reset to default
                    </button>
                  </div>
                  <Textarea
                    value={settings.template}
                    onChange={e => updateSetting("template", e.target.value)}
                    rows={4}
                    className="text-[13px] resize-none font-mono"
                    placeholder={DEFAULT_TEMPLATE}
                  />
                </div>

                {/* Supported variables */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium text-muted-foreground">Supported variables</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { variable: "{{customer_name}}", desc: "Customer's first name" },
                      { variable: "{{review_link}}",   desc: "Your Google review URL" },
                    ].map(v => (
                      <div
                        key={v.variable}
                        className="flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/40 px-2 py-1"
                        title={v.desc}
                      >
                        <code className="text-[11px] font-mono text-blue-500">{v.variable}</code>
                        <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">— {v.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                      <Eye className="h-3 w-3" />
                      Preview
                    </p>
                    <button
                      onClick={handleCopyPreview}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied
                        ? <><CheckCheck className="h-3 w-3" /> Copied</>
                        : <><Copy className="h-3 w-3" /> Copy</>
                      }
                    </button>
                  </div>
                  <div className="rounded-lg bg-secondary/30 border border-border/60 p-4">
                    <div className="flex gap-2.5">
                      {/* SMS bubble */}
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="rounded-lg rounded-tl-sm bg-background border border-border/60 px-3 py-2.5 shadow-sm">
                          <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-wrap break-words">
                            {previewMessage}
                          </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 mt-1.5">
                          {previewMessage.length} characters · SMS
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT column */}
          <div className="space-y-5">

            {/* C. Recent Review Requests */}
            <div className="rounded-xl border border-border bg-card">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-semibold text-foreground">Recent Review Requests</h2>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Track the status of outgoing review requests</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground/50 bg-secondary/50 border border-border/60 rounded-full px-2 py-0.5">
                  Demo data
                </span>
              </div>

              <div className="divide-y divide-border/50">
                {DEMO_REQUESTS.map(req => {
                  const cfg = STATUS_CONFIG[req.status]
                  const StatusIcon = cfg.icon
                  return (
                    <div key={req.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/20 transition-colors">
                      {/* Status icon */}
                      <div className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border mt-0.5", cfg.className)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold text-foreground truncate">{req.name}</p>
                          <span className={cn("flex-shrink-0 text-[10px] font-semibold rounded-full border px-2 py-0.5", cfg.className)}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5" />
                            {req.phone}
                          </span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock3 className="h-2.5 w-2.5" />
                            {req.status === "sent" && req.sentAt
                              ? `Sent ${formatDate(req.sentAt)}`
                              : `Scheduled ${formatDate(req.scheduledFor)}`
                            }
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/60 mt-1 truncate">{req.preview}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="px-5 py-3 border-t border-border/50">
                <p className="text-[11px] text-muted-foreground/50 text-center">
                  Live request tracking activates when SMS delivery is connected
                </p>
              </div>
            </div>

            {/* D. Eligible Leads — real data, actionable send buttons */}
            <div className="rounded-xl border border-border bg-card">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-semibold text-foreground">Eligible for Review Request</h2>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Completed leads with a phone number on file</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground/50 bg-secondary/50 border border-border/60 rounded-full px-2 py-0.5">
                  {eligibleLeads.length} lead{eligibleLeads.length !== 1 ? "s" : ""}
                </span>
              </div>

              {eligibleLeads.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-[13px] text-muted-foreground">No completed leads with a phone number yet.</p>
                  <p className="text-[12px] text-muted-foreground/60 mt-1">Mark a lead as Completed to see it here.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
                  {eligibleLeads.map(lead => {
                    const state = sendState[lead.id] ?? "idle"
                    return (
                      <div key={lead.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-foreground truncate">{lead.name}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="h-2.5 w-2.5" />
                            {lead.phone}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSendReviewRequest({ id: lead.id, name: lead.name, phone: lead.phone })}
                          disabled={state === "sending" || state === "sent" || !settings.reviewLink.trim()}
                          title={!settings.reviewLink.trim() ? "Add a Google review link in settings first" : undefined}
                          className={cn(
                            "flex-shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all",
                            state === "sent"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default"
                              : state === "error"
                              ? "bg-red-500/10 text-red-600 dark:text-red-400"
                              : state === "sending"
                              ? "bg-secondary/60 text-muted-foreground cursor-wait"
                              : !settings.reviewLink.trim()
                              ? "bg-secondary/40 text-muted-foreground/50 cursor-not-allowed"
                              : "bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20"
                          )}
                        >
                          {state === "sending" && <Loader2 className="h-3 w-3 animate-spin" />}
                          {state === "sent"    && <CheckCheck className="h-3 w-3" />}
                          {state === "error"   && <AlertCircle className="h-3 w-3" />}
                          {state === "idle"    && <Send className="h-3 w-3" />}
                          {state === "sending" ? "Sending…" : state === "sent" ? "Sent" : state === "error" ? "Retry" : "Send"}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {!settings.reviewLink.trim() && eligibleLeads.length > 0 && (
                <div className="px-5 py-3 border-t border-border/50">
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    Add your Google review link above to enable sending
                  </p>
                </div>
              )}
            </div>

            {/* E. Eligibility Rules */}
            <div className="rounded-xl border border-border bg-card">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-[13px] font-semibold text-foreground">Eligibility Rules</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">A review request is only sent when all conditions are met</p>
              </div>

              <div className="p-5 space-y-2.5">
                {[
                  { met: true,  text: "Lead is marked as Completed" },
                  { met: true,  text: "Lead has a phone number on file" },
                  { met: savedOnce && settings.enabled, text: "Review automation is enabled" },
                  { met: !!settings.reviewLink.trim(), text: "Google review link is saved" },
                  { met: true,  text: "Review request has not already been sent" },
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={cn(
                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full mt-0.5",
                      rule.met
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-secondary/60 text-muted-foreground/40"
                    )}>
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <p className={cn(
                      "text-[13px] leading-tight",
                      rule.met ? "text-foreground" : "text-muted-foreground/60"
                    )}>
                      {rule.text}
                    </p>
                  </div>
                ))}

                {/* Behavioral note */}
                <div className="flex items-start gap-2.5 pt-1 mt-1 border-t border-border/60">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center mt-0.5">
                    <CircleDot className="h-3.5 w-3.5 text-muted-foreground/40" />
                  </div>
                  <p className="text-[12px] text-muted-foreground/60 leading-relaxed">
                    If a lead leaves <span className="font-medium text-muted-foreground">Completed</span> status before the request is sent, the pending request is automatically canceled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Integration footer card ── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/60">
                <Plug className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13px] font-semibold text-foreground">SMS Delivery</p>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                    Connected
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed max-w-xl">
                  Review requests are sent via SMS using your Twilio integration. Use the &quot;Eligible for Review Request&quot;
                  section above to send manually, or enable automation to send automatically after jobs are completed.
                  If Twilio is not yet configured, messages are logged locally without being delivered.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <Shield className="h-3.5 w-3.5" />
                Settings ready
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <Send className="h-3.5 w-3.5" />
                Send active
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function ReviewStatCard({
  label, value, sub, accent, demo,
}: {
  label: string
  value: string
  sub?: string
  accent?: "green" | "gray" | "blue" | "amber" | "emerald"
  demo?: boolean
}) {
  const accentClass = {
    green:   "text-emerald-600 dark:text-emerald-400",
    gray:    "text-muted-foreground",
    blue:    "text-blue-600 dark:text-blue-400",
    amber:   "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  }[accent ?? "gray"]

  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">{label}</p>
        {demo && <span className="text-[9px] text-muted-foreground/40">demo</span>}
      </div>
      <p className={cn("text-[15px] font-semibold tabular-nums truncate", accentClass)}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground/50 mt-0.5 truncate">{sub}</p>}
    </div>
  )
}
