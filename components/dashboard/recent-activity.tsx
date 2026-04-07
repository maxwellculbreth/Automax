"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useActivities } from "@/hooks/use-data"
import { formatRelativeTime, formatCurrency } from "@/lib/data-service"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  lead_created: UserPlus,
  message_sent: MessageSquare,
  quote_sent: FileText,
  job_booked: CalendarCheck,
  automation_triggered: Zap,
  follow_up_scheduled: Activity,
  job_completed: CheckCircle2,
  review_received: Star,
}

const colorMap = {
  lead_created: "text-blue-600 dark:text-blue-400",
  message_sent: "text-slate-600 dark:text-slate-400",
  quote_sent: "text-violet-600 dark:text-violet-400",
  job_booked: "text-emerald-600 dark:text-emerald-400",
  automation_triggered: "text-amber-600 dark:text-amber-400",
  follow_up_scheduled: "text-slate-600 dark:text-slate-400",
  job_completed: "text-emerald-600 dark:text-emerald-400",
  review_received: "text-amber-500 dark:text-amber-400",
}

export function RecentActivityFeed() {
  const { activities, isLoading } = useActivities(8)

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3.5 animate-pulse">
              <div className="h-4 w-4 rounded bg-muted" />
              <div className="flex-1">
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="mt-1.5 h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <Activity className="h-4 w-4" />
          <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center px-5">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <p className="mt-3 text-[13px] font-medium text-foreground">No activity yet</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Activity will appear as you work
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <h3 className="text-[13px] font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.slice(0, 6).map((activity) => {
          const activityType = activity.type || "lead_updated"
          const Icon = iconMap[activityType as keyof typeof iconMap] || Activity
          const color = colorMap[activityType as keyof typeof colorMap] || "text-slate-600"
          const metadata = (activity.metadata || {}) as { lead_name?: string; value?: number }
          const description = activity.description || "Activity recorded"

          return (
            <div key={activity.id} className="flex items-start gap-3 px-4 py-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className={cn("h-3.5 w-3.5", color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-foreground">
                  {description}
                  {metadata?.value && (
                    <span className="font-medium"> {formatCurrency(metadata.value)}</span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {metadata?.lead_name && activity.lead_id && (
                    <>
                      <Link
                        href={`/leads?id=${activity.lead_id}`}
                        className="text-[12px] font-medium text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {metadata.lead_name}
                      </Link>
                      <span className="text-muted-foreground">·</span>
                    </>
                  )}
                  {metadata?.lead_name && !activity.lead_id && (
                    <>
                      <span className="text-[12px] text-muted-foreground">
                        {metadata.lead_name}
                      </span>
                      <span className="text-muted-foreground">·</span>
                    </>
                  )}
                  <span className="text-[12px] text-muted-foreground">
                    {formatRelativeTime(activity.created_at || new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="border-t border-border p-3">
        <Button variant="ghost" size="sm" className="w-full text-[12px] h-8 text-muted-foreground hover:text-foreground">
          View all activity
        </Button>
      </div>
    </div>
  )
}
