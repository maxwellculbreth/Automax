"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useActivities } from "@/hooks/use-data"
import { formatRelativeTime, formatCurrency, type Activity } from "@/lib/data-service"
import type { ActivityFeedMeta } from "@/lib/data-service"
import {
  Loader2,
  UserPlus,
  MessageSquare,
  FileText,
  CalendarCheck,
  Zap,
  Activity as ActivityIcon,
  CheckCircle2,
  Star,
  ArrowRight,
  Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Icon / colour maps ───────────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  lead_created:           UserPlus,
  lead_updated:           Pencil,
  message_sent:           MessageSquare,
  message_received:       MessageSquare,
  quote_sent:             FileText,
  job_booked:             CalendarCheck,
  automation_triggered:   Zap,
  follow_up_scheduled:    ActivityIcon,
  job_completed:          CheckCircle2,
  review_received:        Star,
  note_added:             Pencil,
}

const iconColorMap: Record<string, string> = {
  lead_created:           "text-blue-600 dark:text-blue-400",
  lead_updated:           "text-slate-500 dark:text-slate-400",
  message_sent:           "text-slate-500 dark:text-slate-400",
  message_received:       "text-slate-500 dark:text-slate-400",
  quote_sent:             "text-violet-600 dark:text-violet-400",
  job_booked:             "text-emerald-600 dark:text-emerald-400",
  automation_triggered:   "text-amber-600 dark:text-amber-400",
  follow_up_scheduled:    "text-slate-500 dark:text-slate-400",
  job_completed:          "text-emerald-600 dark:text-emerald-400",
  review_received:        "text-amber-500 dark:text-amber-400",
  note_added:             "text-slate-500 dark:text-slate-400",
}

// ── Event text builder ───────────────────────────────────────────────────────
// Rebuilds the event row from live metadata. Never reads description.

interface EventRow {
  label: string           // primary event label, e.g. "Quote sent"
  detail: string | null   // secondary detail, e.g. "$350 · Driveway Cleaning"
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function buildEventRow(type: string, meta: ActivityFeedMeta): EventRow {
  const service = meta.service_type ? capitalize(meta.service_type) : null
  const rawTitle = meta.raw_title ?? ""
  const amount = (meta.job_price ?? meta.quote_amount ?? 0)
  const amountStr = amount > 0 ? formatCurrency(amount) : null
  const jobOrService = meta.job_title || service

  switch (type) {
    case "lead_created":
      return {
        label: "New lead inquiry",
        detail: service,
      }

    case "quote_sent":
      return {
        label: "Quote sent",
        detail: [amountStr, service].filter(Boolean).join(" · ") || null,
      }

    case "job_booked": {
      return {
        label: "Job scheduled",
        detail: [jobOrService, amountStr].filter(Boolean).join(" · ") || null,
      }
    }

    case "job_completed":
      return {
        label: "Job completed",
        detail: [jobOrService, amountStr].filter(Boolean).join(" · ") || null,
      }

    case "message_sent":
      return { label: "Message sent", detail: null }

    case "message_received":
      return { label: "Message received", detail: null }

    case "review_received":
      return { label: "Review received", detail: null }

    case "follow_up_scheduled":
      return { label: "Follow-up scheduled", detail: null }

    case "note_added":
      return { label: "Note added", detail: null }

    case "automation_triggered": {
      // Use raw_title if clean enough, otherwise generic label
      const cleanedTitle = rawTitle.replace(/^[A-Z\s]+ - /i, "").trim()
      return {
        label: cleanedTitle || "Automation triggered",
        detail: null,
      }
    }

    case "lead_updated": {
      // Parse common title patterns to produce a clean label + detail
      const t = rawTitle.toLowerCase()

      if (t.includes("status")) {
        // e.g. "Status updated to scheduled" or "Hannah - Status updated to scheduled"
        const match = rawTitle.match(/status\s+updated\s+to\s+(\w+)/i)
        const status = match?.[1] ? capitalize(match[1]) : null
        return {
          label: "Status updated",
          detail: status ? `→ ${status}` : null,
        }
      }

      if (t.includes("quote") || t.includes("$")) {
        return {
          label: "Quote updated",
          detail: amountStr,
        }
      }

      if (t.includes("scheduled") || t.includes("booked")) {
        return {
          label: "Job scheduled",
          detail: [jobOrService, amountStr].filter(Boolean).join(" · ") || null,
        }
      }

      if (t.includes("completed")) {
        return {
          label: "Job completed",
          detail: amountStr,
        }
      }

      // Fallback: strip any leading "NAME - " prefix from raw_title, show what's left
      const cleaned = rawTitle.replace(/^[A-Z][A-Z\s]+ - /i, "").trim()
      return {
        label: cleaned || "Lead updated",
        detail: service,
      }
    }

    default: {
      const cleaned = rawTitle.replace(/^[A-Z][A-Z\s]+ - /i, "").trim()
      return {
        label: cleaned || "Activity",
        detail: service,
      }
    }
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function RecentActivityFeed() {
  const { activities, isLoading } = useActivities(10)

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3.5 animate-pulse">
              <div className="h-7 w-7 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-0.5">
                <div className="h-3.5 w-36 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            <ActivityIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60">
            <ActivityIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-3 text-[13px] font-medium text-foreground">No activity yet</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Events will appear here as you work
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            <ActivityIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">Live</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connector */}
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border/50" />

        <div className="divide-y divide-border/50">
          {activities.slice(0, 8).map((activity) => {
            const type = activity.type || "lead_updated"
            const Icon = iconMap[type] ?? ActivityIcon
            const color = iconColorMap[type] ?? "text-slate-500"
            const meta = (activity.metadata ?? {}) as ActivityFeedMeta
            const { label, detail } = buildEventRow(type, meta)
            const customerName = meta.lead_name ?? null
            const hasLink = !!activity.lead_id

            return (
              <div key={activity.id} className="flex items-start gap-3 px-4 py-3 relative">
                {/* Icon bubble sits on the timeline */}
                <div className="relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-card ring-2 ring-border mt-0.5">
                  <Icon className={cn("h-3.5 w-3.5", color)} />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Primary label + time on same line */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12.5px] font-medium text-foreground leading-snug">
                      {label}
                    </p>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0 mt-px">
                      {formatRelativeTime(activity.created_at || new Date().toISOString())}
                    </span>
                  </div>

                  {/* Secondary line: customer name + optional detail */}
                  {(customerName || detail) && (
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {customerName && (
                        hasLink ? (
                          <Link
                            href={`/leads?id=${activity.lead_id}`}
                            className="text-[11.5px] font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate"
                          >
                            {customerName}
                          </Link>
                        ) : (
                          <span className="text-[11.5px] font-semibold text-muted-foreground truncate">
                            {customerName}
                          </span>
                        )
                      )}
                      {customerName && detail && (
                        <span className="text-muted-foreground/50 text-[11px]">·</span>
                      )}
                      {detail && (
                        <span className="text-[11.5px] text-muted-foreground truncate">
                          {detail}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border p-3 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[12px] h-8 text-muted-foreground hover:text-foreground"
        >
          View all activity <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
}
