"use client"

import { useDashboardKPIs } from "@/hooks/use-data"
import { type DateRangeKey } from "@/lib/data-service"
import { Clock, TrendingUp, RefreshCw, Target, Loader2 } from "lucide-react"

const growthLabelMap: Record<DateRangeKey, { label: string; description: string }> = {
  week: { label: "Weekly Growth", description: "Revenue vs. last week" },
  month: { label: "Monthly Growth", description: "Revenue vs. last month" },
  quarter: { label: "Quarterly Growth", description: "Revenue vs. last quarter" },
  year: { label: "Annual Growth", description: "Revenue vs. last year" },
}

interface PerformanceMetricsProps {
  range?: DateRangeKey
}

export function PerformanceMetrics({ range = "week" }: PerformanceMetricsProps) {
  const { kpis, isLoading } = useDashboardKPIs(range)
  const growth = growthLabelMap[range]

  const metrics = [
    {
      label: "Avg. Response Time",
      value: kpis?.avgResponseTime ?? "-",
      target: "< 5 min",
      status: "good",
      icon: Clock,
      description: "Speed to first response",
    },
    {
      label: "Close Rate",
      value: kpis ? `${kpis.conversionRate}%` : "-",
      target: "65%",
      status: "good",
      icon: Target,
      description: "Leads to booked jobs",
    },
    {
      label: "Repeat Customer Rate",
      value: kpis ? `${kpis.repeatCustomerRate}%` : "-",
      target: "30%",
      status: "good",
      icon: RefreshCw,
      description: "Customers who return",
    },
    {
      label: growth.label,
      value: kpis ? (kpis.weeklyGrowth >= 0 ? `+${kpis.weeklyGrowth}%` : `${kpis.weeklyGrowth}%`) : "-",
      target: "10%",
      status: "good",
      icon: TrendingUp,
      description: growth.description,
    },
  ]

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card animate-pulse">
        <div className="border-b border-border px-4 py-3.5">
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`px-4 py-4 ${
              i < 2 ? 'border-b lg:border-b-0 border-border' : ''
            } ${i % 2 === 0 ? 'border-r border-border' : ''} ${
              i < 3 ? 'lg:border-r lg:border-border' : ''
            }`}>
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="mt-2 h-6 w-16 rounded bg-muted" />
              <div className="mt-2 h-3 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3.5">
        <h3 className="text-[13px] font-semibold text-foreground">Performance</h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">Key metrics for your business</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div 
            key={metric.label} 
            className={`px-4 py-4 ${
              index < 2 ? 'border-b lg:border-b-0 border-border' : ''
            } ${index % 2 === 0 ? 'border-r border-border' : ''} ${
              index < 3 ? 'lg:border-r lg:border-border' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <metric.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-[12px] font-medium text-muted-foreground">
                {metric.label}
              </span>
            </div>
            <p className="mt-2 text-xl font-semibold text-foreground tabular-nums">
              {metric.value}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                On target
              </span>
              <span className="text-[11px] text-muted-foreground">
                Target: {metric.target}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
