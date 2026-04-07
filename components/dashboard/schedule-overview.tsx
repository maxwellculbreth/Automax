"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUpcomingJobs, useLeads } from "@/hooks/use-data"
import { Calendar, MapPin, Loader2 } from "lucide-react"

export function ScheduleOverview() {
  const { jobs, isLoading: jobsLoading } = useUpcomingJobs(5)
  const { leads, isLoading: leadsLoading } = useLeads()

  const isLoading = jobsLoading || leadsLoading

  // Enrich jobs with lead data
  const enrichedJobs = jobs.map((job) => {
    const lead = leads.find((l) => l.id === job.lead_id)
    return {
      ...job,
      customerName: lead?.name ?? "Unknown",
      address: lead?.address ?? "",
    }
  })

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <h3 className="text-[13px] font-semibold text-foreground">Today&apos;s Schedule</h3>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 animate-pulse">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="mt-2 h-4 w-32 rounded bg-muted" />
              <div className="mt-1.5 h-3 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (enrichedJobs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/10">
            <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Today&apos;s Schedule</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center px-5">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <p className="mt-3 text-[13px] font-medium text-foreground">No jobs scheduled</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Jobs will appear here when booked
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/10">
            <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Upcoming Jobs</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {enrichedJobs.length} scheduled
        </span>
      </div>
      <div className="divide-y divide-border">
        {enrichedJobs.map((job) => {
          // Null-safe date formatting
          const formattedDate = job.scheduled_date 
            ? new Date(job.scheduled_date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            : "Date TBD"
          
          return (
            <div key={job.id} className="px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md bg-blue-600/10 dark:bg-blue-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300 tabular-nums">
                      {job.scheduled_time || "TBD"}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {formattedDate}
                    </span>
                  </div>
                  <p className="text-[13px] font-medium text-foreground mt-1.5 truncate">
                    {job.customerName || "Unknown Customer"}
                  </p>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                    {job.title || "Untitled Job"}
                  </p>
                  {job.address && (
                    <div className="flex items-center gap-1 mt-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{job.address}</span>
                    </div>
                  )}
                </div>
                <span className="text-[13px] font-semibold text-foreground tabular-nums flex-shrink-0">
                  ${job.price || 0}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="border-t border-border p-3">
        <Button variant="ghost" size="sm" className="w-full text-[12px] h-8 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/pipeline">View full schedule</Link>
        </Button>
      </div>
    </div>
  )
}
