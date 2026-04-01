"use client"

import { DashboardKPIs } from "@/components/dashboard/kpi-cards"
import { NeedsActionPanel } from "@/components/dashboard/needs-action-panel"
import { RecentActivityFeed } from "@/components/dashboard/recent-activity"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { ScheduleOverview } from "@/components/dashboard/schedule-overview"
import { useCompany } from "@/hooks/use-data"

export default function DashboardPage() {
  const { company, isLoading } = useCompany()

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
          <div className="sm:text-right">
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
        {/* KPI Cards */}
        <DashboardKPIs />

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
          <PerformanceMetrics />
        </div>
      </div>
    </div>
  )
}
