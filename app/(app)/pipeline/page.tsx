"use client"

import { type ElementType, useState } from "react"
import { KanbanBoard } from "@/components/pipeline/kanban-board"
import { useLeads, useUpdateLead } from "@/hooks/use-data"
import {
  type CanonicalLeadStatus,
  formatCurrency,
  getStatusLabel,
  normalizeStatus,
  isScheduledStatus,
  isCompletedStatus,
} from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Users, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { AddLeadDialog } from "@/components/leads/add-lead-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type Timeframe = "all" | "today" | "this-week" | "this-month" | "this-quarter"

const timeframes: { value: Timeframe; label: string }[] = [
  { value: "all",           label: "All Time" },
  { value: "today",         label: "Today" },
  { value: "this-week",     label: "This Week" },
  { value: "this-month",    label: "This Month" },
  { value: "this-quarter",  label: "This Quarter" },
]

function isInTimeframe(dateStr: string | null | undefined, timeframe: Timeframe): boolean {
  if (timeframe === "all") return true
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (timeframe === "today") {
    return date >= startOfDay
  }
  if (timeframe === "this-week") {
    const dayOfWeek = now.getDay() // 0 = Sunday
    const startOfWeek = new Date(startOfDay)
    startOfWeek.setDate(startOfDay.getDate() - dayOfWeek)
    return date >= startOfWeek
  }
  if (timeframe === "this-month") {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }
  if (timeframe === "this-quarter") {
    const q = Math.floor(now.getMonth() / 3)
    const startOfQuarter = new Date(now.getFullYear(), q * 3, 1)
    return date >= startOfQuarter
  }
  return true
}

export default function PipelinePage() {
  const { leads, isLoading, mutate: mutateLeads } = useLeads()
  const { updateLead } = useUpdateLead()
  const [timeframe, setTimeframe] = useState<Timeframe>("all")
  const [showAddLead, setShowAddLead] = useState(false)

  const filteredLeads = leads.filter((l) => isInTimeframe(l.created_at, timeframe))

  const activeLeads = filteredLeads.filter(
    (l) => !["lost", "cancelled"].includes(normalizeStatus(l.status))
  )
  const pipelineTotal = filteredLeads.reduce((sum, l) => sum + (l.estimated_value || 0), 0)
  const scheduledLeads = filteredLeads.filter((l) => isScheduledStatus(l.status))
  const scheduledValue = scheduledLeads.reduce((sum, l) => sum + (l.estimated_value || 0), 0)
  const collectedValue = filteredLeads
    .filter((l) => isCompletedStatus(l.status))
    .reduce((sum, l) => sum + (l.estimated_value || 0), 0)

  const handleDragEnd = async (leadId: string, newStatus: CanonicalLeadStatus) => {
    const lead = leads.find((l) => l.id === leadId)
    const leadName = lead?.name || "Lead"
    try {
      const updates: { status: CanonicalLeadStatus; completed_at?: string } = { status: newStatus }
      if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString()
      }
      const result = await updateLead({ id: leadId, updates })
      if (result) {
        toast.success(`${leadName} moved to ${getStatusLabel(newStatus)}`, { duration: 2000 })
      } else {
        toast.error("Failed to update status", { description: "Please try again" })
      }
      mutateLeads()
    } catch {
      toast.error("Failed to update status")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background pt-14 lg:pt-0">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-[13px] text-muted-foreground">Loading pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-5 sm:px-6">
        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-foreground">Pipeline</h1>
          <div className="flex items-center gap-2">
            {/* Timeframe filter */}
            <div className="hidden sm:flex items-center gap-0.5 rounded-lg border border-border bg-secondary/30 p-1">
              {timeframes.map((t) => (
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
            {/* Mobile timeframe select */}
            <select
              className="sm:hidden h-8 rounded-md border border-border bg-background px-2 text-[13px] text-foreground"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            >
              {timeframes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <Button size="sm" className="h-8 text-[13px]" onClick={() => setShowAddLead(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Active Leads"
            value={String(activeLeads.length)}
            icon={Users}
          />
          <StatCard
            label="Pipeline Total"
            value={formatCurrency(pipelineTotal)}
            icon={TrendingUp}
          />
          <StatCard
            label="Scheduled"
            value={scheduledLeads.length > 0
              ? `${scheduledLeads.length} job${scheduledLeads.length !== 1 ? "s" : ""} · ${formatCurrency(scheduledValue)}`
              : "—"
            }
            icon={Calendar}
          />
          <StatCard
            label="Collected"
            value={collectedValue > 0 ? formatCurrency(collectedValue) : "—"}
            icon={DollarSign}
            accent
          />
        </div>
      </header>

      {/* Kanban Board */}
      <div className="overflow-x-auto py-5">
        <KanbanBoard leads={filteredLeads} onDragEnd={handleDragEnd} />
      </div>

      <AddLeadDialog open={showAddLead} onOpenChange={setShowAddLead} />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  icon: ElementType
  accent?: boolean
}

function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", accent ? "text-emerald-500" : "text-muted-foreground")} />
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">
          {label}
        </span>
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
