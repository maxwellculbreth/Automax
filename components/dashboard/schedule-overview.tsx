"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTodayJobs, useWeekJobs, useLeads } from "@/hooks/use-data"
import { Calendar, Clock, MapPin, Loader2, CheckCircle2, ChevronRight } from "lucide-react"
import { formatCurrency } from "@/lib/data-service"
import { cn } from "@/lib/utils"


function formatWeekLabel(scheduledDate: string | null | undefined): string {
  if (!scheduledDate) return ""
  // scheduled_date is "YYYY-MM-DD" from the mapper
  const parts = scheduledDate.split("-").map(Number)
  // Build date in local time to avoid UTC offset shift
  const d = new Date(parts[0], parts[1] - 1, parts[2])
  const today = new Date()
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  if (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  ) return "Today"
  if (
    d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate()
  ) return "Tomorrow"
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

interface EnrichedJob {
  id: string
  customerName: string
  title: string
  scheduledDate: string | null
  scheduledTime: string | null
  price: number
  address: string | null
  status: string
}

function JobRow({ job, showDate = false }: { job: EnrichedJob; showDate?: boolean }) {
  const isDone = job.status === "completed"
  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3 border-l-2",
      isDone ? "border-l-emerald-500/40" : "border-l-blue-500/40"
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {showDate ? (
            <span className="text-[11px] font-semibold text-muted-foreground">
              {formatWeekLabel(job.scheduledDate)}
            </span>
          ) : null}
          <span className={cn(
            "rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
            isDone
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-blue-600/10 text-blue-700 dark:text-blue-300"
          )}>
            {job.scheduledTime || "TBD"}
          </span>
          {isDone && (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-[13px] font-semibold text-foreground mt-1.5 truncate">
          {job.customerName || "Unknown Customer"}
        </p>
        <p className="text-[12px] text-muted-foreground truncate">
          {job.title || "Untitled Job"}
        </p>
        {job.address && (
          <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{job.address}</span>
          </div>
        )}
      </div>
      <span className="text-[13px] font-semibold text-foreground tabular-nums flex-shrink-0 mt-1">
        {formatCurrency(job.price)}
      </span>
    </div>
  )
}

export function ScheduleOverview() {
  const { jobs: todayJobs, isLoading: todayLoading } = useTodayJobs()
  const { jobs: weekJobs, isLoading: weekLoading } = useWeekJobs()
  const { leads, isLoading: leadsLoading } = useLeads()

  const isLoading = todayLoading || weekLoading || leadsLoading

  function formatStartTime(t: string | null | undefined): string | null {
    if (!t) return null
    const [h, m] = t.split(":").map(Number)
    const ampm = h >= 12 ? "PM" : "AM"
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`
  }

  function enrichJobs(jobs: typeof todayJobs): EnrichedJob[] {
    return jobs.map((job) => {
      const lead = leads.find((l) => l.id === job.lead_id)
      return {
        id: job.id,
        customerName: job.customer_name || lead?.name || "Unknown",
        title: job.title ?? "Untitled Job",
        scheduledDate: job.scheduled_date ?? null,
        scheduledTime: formatStartTime(job.start_time),
        price: job.quoted_amount ?? 0,
        address: job.property_address ?? lead?.address ?? null,
        status: job.status ?? "scheduled",
      }
    })
  }

  const enrichedToday = enrichJobs(todayJobs)
  // Week section: all week jobs excluding ones already shown in today
  const todayIds = new Set(todayJobs.map((j) => j.id))
  const enrichedWeekOther = enrichJobs(weekJobs.filter((j) => !todayIds.has(j.id)))

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <h3 className="text-[13px] font-semibold text-foreground">Schedule</h3>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 animate-pulse space-y-2">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const hasAny = enrichedToday.length > 0 || enrichedWeekOther.length > 0

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/10">
            <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Schedule</h3>
        </div>
        {hasAny && (
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {enrichedToday.length + enrichedWeekOther.length} jobs
          </span>
        )}
      </div>

      {!hasAny ? (
        <div className="flex flex-col items-center justify-center py-10 text-center px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-3 text-[13px] font-medium text-foreground">Nothing scheduled</p>
          <p className="mt-1 text-[12px] text-muted-foreground max-w-[180px]">
            Jobs will appear here once booked from the Pipeline
          </p>
          <Button variant="outline" size="sm" className="mt-4 h-8 text-[12px]" asChild>
            <Link href="/pipeline">Open Pipeline</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Today section */}
          {enrichedToday.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Today — {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
                <span className="ml-auto text-[11px] text-muted-foreground">{enrichedToday.length} job{enrichedToday.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="divide-y divide-border/60">
                {enrichedToday.map((job) => (
                  <JobRow key={job.id} job={job} showDate={false} />
                ))}
              </div>
            </div>
          )}

          {/* Rest of week section */}
          {enrichedWeekOther.length > 0 && (
            <div className={cn(enrichedToday.length > 0 && "border-t border-border")}>
              <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  This Week
                </span>
                <span className="ml-auto text-[11px] text-muted-foreground">{enrichedWeekOther.length} more</span>
              </div>
              <div className="divide-y divide-border/60">
                {enrichedWeekOther.slice(0, 4).map((job) => (
                  <JobRow key={job.id} job={job} showDate={true} />
                ))}
                {enrichedWeekOther.length > 4 && (
                  <div className="px-4 py-2.5">
                    <Link href="/pipeline" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                      +{enrichedWeekOther.length - 4} more this week
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="border-t border-border p-3 mt-auto">
        <Button variant="ghost" size="sm" className="w-full text-[12px] h-8 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/pipeline">View full schedule <ChevronRight className="h-3.5 w-3.5 ml-1" /></Link>
        </Button>
      </div>
    </div>
  )
}
