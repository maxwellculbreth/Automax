"use client"

import { useDashboardKPIs } from "@/hooks/use-data"
import { type DateRangeKey, type CustomDateRange } from "@/lib/data-service"
import { Clock, TrendingUp, RefreshCw, Target, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const growthLabelMap: Record<DateRangeKey, { label: string; description: string }> = {
  week:    { label: "Weekly Growth",    description: "Revenue vs. last week" },
  month:   { label: "Monthly Growth",   description: "Revenue vs. last month" },
  quarter: { label: "Quarterly Growth", description: "Revenue vs. last quarter" },
  year:    { label: "Annual Growth",    description: "Revenue vs. last year" },
}

interface PerformanceMetricsProps {
  range?: DateRangeKey
  customRange?: CustomDateRange
  isCustom?: boolean
}

export function PerformanceMetrics({ range = "week", customRange, isCustom = false }: PerformanceMetricsProps) {
  const { kpis, isLoading } = useDashboardKPIs(range, customRange)
  const growth = growthLabelMap[range]

  const metrics = [
    {
      label: "Avg. Response Time",
      value: kpis?.avgResponseTime ?? "-",
      target: "< 5 min",
      onTarget: true,
      icon: Clock,
      description: "Speed to first response",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Close Rate",
      value: kpis ? `${kpis.conversionRate}%` : "-",
      target: "65%",
      onTarget: kpis ? kpis.conversionRate >= 65 : true,
      icon: Target,
      description: "Leads to booked jobs",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Repeat Customer Rate",
      value: kpis ? `${kpis.repeatCustomerRate}%` : "-",
      target: "30%",
      onTarget: kpis ? kpis.repeatCustomerRate >= 30 : true,
      icon: RefreshCw,
      description: "Customers who return",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: isCustom ? "Period Growth" : growth.label,
      value: kpis
        ? kpis.weeklyGrowth >= 0
          ? `+${kpis.weeklyGrowth}%`
          : `${kpis.weeklyGrowth}%`
        : "-",
      target: "+10%",
      onTarget: kpis ? kpis.weeklyGrowth >= 10 : true,
      icon: TrendingUp,
      description: isCustom ? "vs. prior period" : growth.description,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
  ]

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden animate-pulse">
        <div className="border-b border-border px-5 py-4">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="mt-1 h-3 w-40 rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "px-5 py-5",
                i < 2 ? "border-b lg:border-b-0 border-border" : "",
                i % 2 === 0 ? "border-r border-border" : "",
                i < 3 ? "lg:border-r lg:border-border" : ""
              )}
            >
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="mt-2.5 h-7 w-16 rounded bg-muted" />
              <div className="mt-2 h-3 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-[13px] font-semibold text-foreground">Performance</h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">Key business health metrics</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "px-5 py-5",
              index < 2 ? "border-b lg:border-b-0 border-border" : "",
              index % 2 === 0 ? "border-r border-border" : "",
              index < 3 ? "lg:border-r lg:border-border" : ""
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", metric.bg)}>
                <metric.icon className={cn("h-3.5 w-3.5", metric.color)} />
              </div>
              <span className="text-[12px] font-medium text-muted-foreground">{metric.label}</span>
            </div>
            <p className="text-[22px] font-bold text-foreground tabular-nums tracking-tight leading-none">
              {metric.value}
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{metric.description}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className={cn(
                "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                metric.onTarget
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}>
                {metric.onTarget ? "On target" : "Below target"}
              </span>
              <span className="text-[10px] text-muted-foreground">Target: {metric.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
