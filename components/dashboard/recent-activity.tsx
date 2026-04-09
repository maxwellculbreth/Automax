"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useActivities } from "@/hooks/use-data"
import { formatRelativeTime } from "@/lib/data-service"
import {
  Loader2,
  UserPlus,
  MessageSquare,
  FileText,
  CalendarCheck,
  Zap,
  Activity,
  CheckCircle2,
  Star,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  lead_created:           UserPlus,
  lead_updated:           UserPlus,
  message_sent:           MessageSquare,
  message_received:       MessageSquare,
  quote_sent:             FileText,
  job_booked:             CalendarCheck,
  automation_triggered:   Zap,
  follow_up_scheduled:    Activity,
  job_completed:          CheckCircle2,
  review_received:        Star,
  note_added:             FileText,
}

const dotColor: Record<string, string> = {
  lead_created:           "bg-blue-500",
  lead_updated:           "bg-blue-400",
  message_sent:           "bg-slate-400",
  message_received:       "bg-slate-400",
  quote_sent:             "bg-violet-500",
  job_booked:             "bg-emerald-500",
  automation_triggered:   "bg-amber-500",
  follow_up_scheduled:    "bg-slate-400",
  job_completed:          "bg-emerald-600",
  review_received:        "bg-amber-400",
  note_added:             "bg-slate-400",
}

const iconColor: Record<string, string> = {
  lead_created:           "text-blue-600 dark:text-blue-400",
  lead_updated:           "text-blue-500 dark:text-blue-400",
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
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-40 rounded bg-muted" />
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
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60">
            <Activity className="h-5 w-5 text-muted-foreground" />
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
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">Live</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[27px] top-3 bottom-3 w-px bg-border/60" />

        <div className="divide-y divide-border/60">
          {activities.slice(0, 8).map((activity) => {
            const type = activity.type || "lead_updated"
            const Icon = iconMap[type as keyof typeof iconMap] || Activity
            const color = iconColor[type as keyof typeof iconColor] || "text-slate-500"
            const dot = dotColor[type as keyof typeof dotColor] || "bg-slate-400"
            const metadata = (activity.metadata || {}) as { lead_name?: string; value?: number }
            const description = activity.description || "Activity recorded"
            const leadName = metadata?.lead_name

            return (
              <div key={activity.id} className="flex items-start gap-3 px-4 py-3 relative">
                {/* Icon bubble */}
                <div className={cn(
                  "relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-card ring-2 ring-border"
                )}>
                  <Icon className={cn("h-3.5 w-3.5", color)} />
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[12.5px] text-foreground leading-snug">
                    {description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {leadName && activity.lead_id ? (
                      <Link
                        href={`/leads?id=${activity.lead_id}`}
                        className="text-[11.5px] font-medium text-blue-600 dark:text-blue-400 hover:underline truncate"
                      >
                        {leadName}
                      </Link>
                    ) : leadName ? (
                      <span className="text-[11.5px] font-medium text-muted-foreground truncate">
                        {leadName}
                      </span>
                    ) : null}
                    {leadName && <span className="text-muted-foreground/60 text-[11px]">·</span>}
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(activity.created_at || new Date().toISOString())}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border p-3 mt-auto">
        <Button variant="ghost" size="sm" className="w-full text-[12px] h-8 text-muted-foreground hover:text-foreground">
          View all activity <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
}
