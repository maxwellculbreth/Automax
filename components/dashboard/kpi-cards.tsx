"use client"

import { useDashboardKPIs } from "@/hooks/use-data"
import { formatCurrency, dateRangeLabels, type DateRangeKey, type CustomDateRange } from "@/lib/data-service"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const revenueLabelMap: Record<DateRangeKey, string> = {
  week:    "Weekly Revenue",
  month:   "Monthly Revenue",
  quarter: "Quarterly Revenue",
  year:    "Annual Revenue",
}

interface DashboardKPIsProps {
  range?: DateRangeKey
  customRange?: CustomDateRange
  isCustom?: boolean
}

export function DashboardKPIs({ range = "week", customRange, isCustom = false }: DashboardKPIsProps) {
  const { kpis, isLoading } = useDashboardKPIs(range, customRange)
  const periodLabel = isCustom ? "this period" : dateRangeLabels[range]

  const kpiConfig = [
    {
      key: "newLeadsToday",
      label: "New Leads",
      suffix: " today",
      getTrend: (val: number) => val > 0 ? "New opportunities" : "None today",
      getTrendUp: (val: number) => val > 0 ? true : null,
      accent: "blue",
    },
    {
      key: "leadsAwaitingResponse",
      label: "Awaiting Response",
      suffix: "",
      getTrend: (val: number) => val > 0 ? `Need attention now` : "All caught up",
      getTrendUp: (val: number) => val > 0 ? false : true,
      alert: true,
      accent: "amber",
    },
    {
      key: "quotesOutstanding",
      label: "Quotes Out",
      suffix: "",
      getTrend: (val: number) => val > 0 ? `Pending decisions` : "No pending quotes",
      getTrendUp: () => null,
      accent: "violet",
    },
    {
      key: "bookedThisWeek",
      label: isCustom ? "Jobs Booked" : "Booked Jobs",
      suffix: ` ${periodLabel}`,
      getTrend: (val: number) => val > 0 ? "Great momentum" : "Keep following up",
      getTrendUp: (val: number) => val > 0 ? true : null,
      accent: "emerald",
    },
    {
      key: "weeklyRevenue",
      label: isCustom ? "Period Revenue" : revenueLabelMap[range],
      suffix: "",
      isCurrency: true,
      getTrend: (val: number) => val > 0 ? "From booked jobs" : "No bookings yet",
      getTrendUp: (val: number) => val > 0 ? true : null,
      accent: "emerald",
    },
    {
      key: "conversionRate",
      label: "Close Rate",
      suffix: "%",
      getTrend: (val: number) => val >= 50 ? "Above target" : val > 0 ? "Room to improve" : "No data yet",
      getTrendUp: (val: number) => val >= 50 ? true : val > 0 ? false : null,
      accent: "blue",
    },
  ]

  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse shadow-sm">
            <div className="h-3 w-16 sm:w-20 rounded bg-muted" />
            <div className="mt-3 h-7 w-12 sm:w-16 rounded bg-muted" />
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
              "rounded-xl border bg-card p-4 sm:p-5 transition-all duration-200 shadow-sm",
              showAlert
                ? "border-amber-500/40 bg-amber-500/[0.04] dark:border-amber-500/30 dark:bg-amber-900/10"
                : "border-border hover:border-border/80 hover:shadow-md"
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">
              {kpi.label}
            </p>
            <p className={cn(
              "mt-2.5 text-[26px] sm:text-[28px] font-bold tabular-nums tracking-tight leading-none",
              showAlert
                ? "text-amber-600 dark:text-amber-400"
                : (rawValue || 0) > 0 && kpi.accent === "emerald"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-foreground"
            )}>
              {value}
            </p>
            <div className="mt-2 flex items-center gap-1">
              {trendUp !== null && (
                trendUp
                  ? <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  : <TrendingDown className="h-3 w-3 text-amber-500 dark:text-amber-400 flex-shrink-0" />
              )}
              <span className={cn(
                "text-[11px] leading-none",
                trendUp === true  && "text-emerald-600 dark:text-emerald-400",
                trendUp === false && "text-amber-500 dark:text-amber-400",
                trendUp === null  && "text-muted-foreground"
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
