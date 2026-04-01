"use client"

import { useDashboardKPIs } from "@/hooks/use-data"
import { formatCurrency } from "@/lib/data-service"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const kpiConfig = [
  {
    key: "newLeadsToday",
    label: "New Leads",
    suffix: " today",
    getTrend: (val: number) => val > 0 ? "New opportunities" : "No new leads yet",
    getTrendUp: (val: number) => val > 0 ? true : null,
  },
  {
    key: "leadsAwaitingResponse",
    label: "Awaiting Response",
    suffix: "",
    getTrend: (val: number) => val > 0 ? `${val} need attention` : "All caught up",
    getTrendUp: (val: number) => val > 0 ? false : true,
    alert: true,
  },
  {
    key: "quotesOutstanding",
    label: "Quotes Out",
    suffix: "",
    getTrend: (val: number) => val > 0 ? `${val} pending decisions` : "No pending quotes",
    getTrendUp: () => null,
  },
  {
    key: "bookedThisWeek",
    label: "Booked Jobs",
    suffix: " this week",
    getTrend: (val: number) => val > 0 ? "Great progress" : "Keep following up",
    getTrendUp: (val: number) => val > 0 ? true : null,
  },
  {
    key: "weeklyRevenue",
    label: "Weekly Revenue",
    suffix: "",
    isCurrency: true,
    getTrend: (val: number) => val > 0 ? "From booked jobs" : "No bookings yet",
    getTrendUp: (val: number) => val > 0 ? true : null,
  },
  {
    key: "conversionRate",
    label: "Close Rate",
    suffix: "%",
    getTrend: (val: number) => val >= 50 ? "Above target" : val > 0 ? "Room to improve" : "No data yet",
    getTrendUp: (val: number) => val >= 50 ? true : val > 0 ? false : null,
  },
] as const

export function DashboardKPIs() {
  const { kpis, isLoading } = useDashboardKPIs()

  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
            <div className="h-3 w-16 sm:w-20 rounded bg-muted" />
            <div className="mt-2 h-6 sm:h-7 w-12 sm:w-16 rounded bg-muted" />
            <div className="mt-2 h-3 w-20 sm:w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {kpiConfig.map((kpi) => {
        const rawValue = kpis[kpi.key as keyof typeof kpis] as number
        const value = kpi.isCurrency 
          ? formatCurrency(rawValue || 0) 
          : `${rawValue || 0}${kpi.suffix || ""}`
        const trend = kpi.getTrend(rawValue || 0)
        const trendUp = kpi.getTrendUp(rawValue || 0)
        const showAlert = kpi.alert && rawValue > 0
        
        return (
          <div 
            key={kpi.key} 
            className={cn(
              "rounded-lg border border-border bg-card p-4",
              showAlert && "border-amber-500/30 bg-amber-500/5 dark:border-amber-500/20 dark:bg-amber-500/10"
            )}
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {kpi.label}
            </p>
            <p className={cn(
              "mt-1.5 text-[22px] sm:text-2xl font-semibold tabular-nums tracking-tight leading-none",
              showAlert ? "text-amber-600 dark:text-amber-400" : "text-foreground"
            )}>
              {value}
            </p>
            <div className="mt-2 flex items-center gap-1">
              {trendUp !== null && (
                trendUp ? (
                  <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                )
              )}
              <span className={cn(
                "text-[11px] leading-none",
                trendUp === true && "text-emerald-600 dark:text-emerald-400",
                trendUp === false && "text-amber-600 dark:text-amber-400",
                trendUp === null && "text-muted-foreground"
              )}>
                {trend}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
