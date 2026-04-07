"use client"

import { useState } from "react"
import { DashboardKPIs } from "@/components/dashboard/kpi-cards"
import { NeedsActionPanel } from "@/components/dashboard/needs-action-panel"
import { RecentActivityFeed } from "@/components/dashboard/recent-activity"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { ScheduleOverview } from "@/components/dashboard/schedule-overview"
import { useCompany } from "@/hooks/use-data"
import { dateRangeButtonLabels, formatDateRangeLabel, type DateRangeKey } from "@/lib/data-service"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

const dateRangeKeys: DateRangeKey[] = ["week", "month", "quarter", "year"]

export default function DashboardPage() {
  const { company, isLoading } = useCompany()
  const [range, setRange] = useState<DateRangeKey>("week")

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {isLoading ? "Dashboard" : (company?.name || "Dashboard")}
            </h1>
            <p className="text-[13px] text-muted-foreground">
              {isLoading ? "Loading..." : (company?.name ? "Dashboard" : "Welcome to your dashboard")}
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-[13px] font-medium text-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {company?.location || "Set your location in settings"}
            </p>
          </div>
        </div>
      </header>

      <div className="px-5 py-5 sm:p-6 lg:p-8">
        {/* Date Range Selector */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {dateRangeKeys.map((key) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
                  range === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {dateRangeButtonLabels[key]}
              </button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{formatDateRangeLabel(range)}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                {dateRangeButtonLabels[range]}
              </p>
              <p className="text-[13px] font-semibold text-foreground">
                {formatDateRangeLabel(range)}
              </p>
            </PopoverContent>
          </Popover>
        </div>

        {/* KPI Cards */}
        <DashboardKPIs range={range} />

        {/* Main Grid */}
        <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-3">
          {/* Left Column - Needs Action */}
          <div className="lg:col-span-1">
            <NeedsActionPanel />
          </div>

          {/* Middle Column - Schedule */}
          <div className="lg:col-span-1">
            <ScheduleOverview />
          </div>

          {/* Right Column - Activity */}
          <div className="lg:col-span-1">
            <RecentActivityFeed />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-5 sm:mt-6">
          <PerformanceMetrics range={range} />
        </div>
      </div>
    </div>
  )
}
