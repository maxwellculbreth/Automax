"use client"

import { type ElementType, useMemo, useState } from "react"
import { mutate as globalMutate } from "swr"
import { KanbanBoard, KANBAN_COLUMNS } from "@/components/pipeline/kanban-board"
import { useLeads, useUpdateLead } from "@/hooks/use-data"
import {
  type Lead,
  type CanonicalLeadStatus,
  formatCurrency,
  getStatusLabel,
  normalizeStatus,
  isScheduledStatus,
  isCompletedStatus,
} from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import {
  Plus, Loader2, Users, TrendingUp, Calendar, DollarSign,
  AlertCircle, MessageSquareDashed, FileQuestion,
} from "lucide-react"
import { AddLeadDialog } from "@/components/leads/add-lead-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ─── Timeframe ────────────────────────────────────────────────────────────────

type Timeframe = "all" | "today" | "this-week" | "this-month" | "this-quarter"

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "all",          label: "All Time" },
  { value: "today",        label: "Today" },
  { value: "this-week",    label: "This Week" },
  { value: "this-month",   label: "This Month" },
  { value: "this-quarter", label: "This Quarter" },
]

function isInTimeframe(dateStr: string | null | undefined, tf: Timeframe): boolean {
  if (tf === "all") return true
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (tf === "today")        return date >= today
  if (tf === "this-week") {
    const sow = new Date(today)
    sow.setDate(today.getDate() - now.getDay())
    return date >= sow
  }
  if (tf === "this-month")   return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  if (tf === "this-quarter") return date >= new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
  return true
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const { leads, isLoading, mutate: mutateLeads } = useLeads()
  const { updateLead }                             = useUpdateLead()
  const [timeframe, setTimeframe]                  = useState<Timeframe>("all")
  const [showAddLead, setShowAddLead]              = useState(false)

  const filteredLeads = useMemo(
    () => leads.filter(l => isInTimeframe(l.created_at, timeframe)),
    [leads, timeframe]
  )

  // ── Stat card values ──────────────────────────────────────────────────────
  const activeLeads    = filteredLeads.filter(l => !["lost", "cancelled"].includes(normalizeStatus(l.status)))
  const completedLeads = filteredLeads.filter(l => isCompletedStatus(l.status))
  const scheduledLeads = filteredLeads.filter(l => isScheduledStatus(l.status))
  const lostLeads      = filteredLeads.filter(l => normalizeStatus(l.status) === "lost")

  const pipelineTotal  = filteredLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0)
  const scheduledValue = scheduledLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0)
  const collectedValue = completedLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0)

  // ── Insights metrics ──────────────────────────────────────────────────────
  const decidedCount   = completedLeads.length + lostLeads.length
  const leadsWithValue = filteredLeads.filter(l => (l.estimated_value ?? 0) > 0)
  const conversionRate = filteredLeads.length > 0  ? Math.round(completedLeads.length / filteredLeads.length * 100) : 0
  const closeRate      = decidedCount > 0           ? Math.round(completedLeads.length / decidedCount * 100) : 0
  const avgTicket      = leadsWithValue.length > 0  ? leadsWithValue.reduce((s, l) => s + (l.estimated_value ?? 0), 0) / leadsWithValue.length : 0

  const stageData = KANBAN_COLUMNS.map(col => ({
    ...col,
    count: filteredLeads.filter(l => normalizeStatus(l.status) === col.id).length,
    value: filteredLeads.filter(l => normalizeStatus(l.status) === col.id).reduce((s, l) => s + (l.estimated_value ?? 0), 0),
  }))
  const maxStageCount = Math.max(...stageData.map(s => s.count), 1)

  // ── Attention items ───────────────────────────────────────────────────────
  const sevenDaysAgo = useMemo(() => new Date(Date.now() - 7 * 86_400_000), [])

  const needsContact = useMemo(() =>
    activeLeads.filter(l => {
      const last = l.last_contact_at ? new Date(l.last_contact_at) : null
      return !last || last < sevenDaysAgo
    }).slice(0, 5),
    [activeLeads, sevenDaysAgo]
  )

  const unquoted = useMemo(() =>
    filteredLeads.filter(l => normalizeStatus(l.status) === "contacted" && !(l.estimated_value ?? 0)).slice(0, 5),
    [filteredLeads]
  )

  const attentionCount = needsContact.length + unquoted.length

  // ── Drag-and-drop with optimistic update ──────────────────────────────────
  const handleDragEnd = async (leadId: string, newStatus: CanonicalLeadStatus) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return
    const prevStatus = lead.status

    // Optimistic: move card immediately — updates both Pipeline AND Lead Inbox
    // because both use the shared SWR "leads" cache key
    globalMutate(
      "leads",
      (current: Lead[] | undefined) =>
        current?.map(l => l.id === leadId ? { ...l, status: newStatus as Lead["status"] } : l) ?? [],
      { revalidate: false }
    )

    try {
      const updates: { status: CanonicalLeadStatus; completed_at?: string } = { status: newStatus }
      if (newStatus === "completed") updates.completed_at = new Date().toISOString()

      const result = await updateLead({ id: leadId, updates })

      if (result) {
        toast.success(`${lead.name} → ${getStatusLabel(newStatus)}`, { duration: 2000 })
        mutateLeads() // confirm with fresh server data
      } else {
        // Revert optimistic update
        globalMutate(
          "leads",
          (current: Lead[] | undefined) =>
            current?.map(l => l.id === leadId ? { ...l, status: prevStatus } : l) ?? [],
          { revalidate: false }
        )
        toast.error("Failed to update status", { description: "Please try again" })
      }
    } catch {
      mutateLeads() // re-fetch to restore true state
      toast.error("Failed to update status")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background pt-14 lg:pt-0">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-card px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-foreground">Pipeline</h1>
          <div className="flex items-center gap-2">
            {/* Desktop timeframe pills */}
            <div className="hidden sm:flex items-center gap-0.5 rounded-lg border border-border bg-secondary/30 p-1">
              {TIMEFRAMES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTimeframe(t.value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors whitespace-nowrap",
                    timeframe === t.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {/* Mobile select */}
            <select
              className="sm:hidden h-8 rounded-md border border-border bg-background px-2 text-[13px] text-foreground"
              value={timeframe}
              onChange={e => setTimeframe(e.target.value as Timeframe)}
            >
              {TIMEFRAMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <Button size="sm" className="h-8 text-[13px]" onClick={() => setShowAddLead(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Active Leads"   value={String(activeLeads.length)}                    icon={Users} />
          <StatCard label="Pipeline Total" value={formatCurrency(pipelineTotal)}                  icon={TrendingUp} />
          <StatCard
            label="Scheduled"
            value={scheduledLeads.length > 0
              ? `${scheduledLeads.length} job${scheduledLeads.length !== 1 ? "s" : ""} · ${formatCurrency(scheduledValue)}`
              : "—"
            }
            icon={Calendar}
          />
          <StatCard label="Collected"     value={collectedValue > 0 ? formatCurrency(collectedValue) : "—"} icon={DollarSign} accent />
        </div>
      </header>

      {/* ── Body: board + insights panel ───────────────────────────────── */}
      <div className="flex">

        {/* Board — scrollable horizontally */}
        <div className="flex-1 min-w-0 overflow-x-auto py-5">
          <KanbanBoard
            leads={filteredLeads}
            onDragEnd={handleDragEnd}
            onAddLead={() => setShowAddLead(true)}
          />
        </div>

        {/* Insights panel — wide enough to breathe */}
        <aside className="hidden xl:flex flex-col w-[320px] flex-shrink-0 border-l border-border bg-card">
          <div className="sticky top-0 max-h-screen overflow-y-auto px-5 py-5 space-y-6">

            {/* Panel header */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-foreground">Pipeline Insights</span>
              {attentionCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-2.5 w-2.5" />
                  {attentionCount} to review
                </span>
              )}
            </div>

            {/* ── Key Metrics ── */}
            <InsightsSection label="Performance">
              <div className="grid grid-cols-2 gap-2.5">
                <MetricTile label="Conv. Rate"  value={`${conversionRate}%`}
                  sub="leads → closed" />
                <MetricTile label="Avg Ticket"  value={avgTicket > 0 ? formatCurrency(avgTicket) : "—"}
                  sub="per lead" />
                <MetricTile label="Close Rate"  value={`${closeRate}%`}
                  sub="of decided leads" />
                <MetricTile label="Revenue"     value={collectedValue > 0 ? formatCurrency(collectedValue) : "—"}
                  sub="collected" accent />
              </div>
            </InsightsSection>

            {/* ── Stage Breakdown ── */}
            <InsightsSection label="Stage Breakdown">
              <div className="space-y-3">
                {stageData.map(stage => (
                  <div key={stage.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", stage.dotColor)} />
                        <span className="text-[12px] text-foreground/80">{stage.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {stage.value > 0 && (
                          <span className="text-[11px] text-muted-foreground tabular-nums">{formatCurrency(stage.value)}</span>
                        )}
                        <span className="text-[11px] font-semibold text-foreground tabular-nums w-5 text-right">{stage.count}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", stage.dotColor, "opacity-60")}
                        style={{ width: `${Math.round(stage.count / maxStageCount * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </InsightsSection>

            {/* ── Needs Attention ── */}
            <InsightsSection label="Needs Attention">
              {attentionCount === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-[12px] text-muted-foreground/50">All caught up</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {needsContact.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <MessageSquareDashed className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-[11px] font-semibold text-muted-foreground">No contact in 7+ days</span>
                      </div>
                      {needsContact.map(l => <AttentionItem key={l.id} lead={l} />)}
                    </div>
                  )}
                  {unquoted.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileQuestion className="h-3.5 w-3.5 text-violet-500" />
                        <span className="text-[11px] font-semibold text-muted-foreground">Contacted but unquoted</span>
                      </div>
                      {unquoted.map(l => <AttentionItem key={l.id} lead={l} />)}
                    </div>
                  )}
                </div>
              )}
            </InsightsSection>

          </div>
        </aside>
      </div>

      <AddLeadDialog open={showAddLead} onOpenChange={setShowAddLead} />
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string; icon: ElementType; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", accent ? "text-emerald-500" : "text-muted-foreground")} />
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">{label}</span>
      </div>
      <p className={cn(
        "text-[15px] font-semibold tabular-nums truncate",
        accent ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
      )}>
        {value}
      </p>
    </div>
  )
}

function InsightsSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-3">{label}</p>
      {children}
    </div>
  )
}

function MetricTile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2.5">
      <p className="text-[10px] font-medium text-muted-foreground/70 truncate">{label}</p>
      <p className={cn(
        "text-[16px] font-bold tabular-nums mt-0.5 truncate",
        accent ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
      )}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-muted-foreground/50 mt-0.5 truncate">{sub}</p>}
    </div>
  )
}

function AttentionItem({ lead }: { lead: Pick<Lead, "id" | "name" | "status"> }) {
  return (
    <a
      href={`/leads?id=${lead.id}`}
      className="flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-secondary/60 transition-colors group"
    >
      <span className="text-[12px] font-medium text-foreground truncate group-hover:underline">{lead.name}</span>
      <span className="text-[10px] text-muted-foreground/60 flex-shrink-0 capitalize">{lead.status}</span>
    </a>
  )
}
