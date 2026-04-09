"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { DashboardKPIs } from "@/components/dashboard/kpi-cards"
import { NeedsActionPanel } from "@/components/dashboard/needs-action-panel"
import { RecentActivityFeed } from "@/components/dashboard/recent-activity"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { ScheduleOverview } from "@/components/dashboard/schedule-overview"
import { Calendar } from "@/components/ui/calendar"
import { useCompany } from "@/hooks/use-data"
import { dateRangeButtonLabels, formatDateRangeLabel, type DateRangeKey, type CustomDateRange } from "@/lib/data-service"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays, ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const dateRangeKeys: DateRangeKey[] = ["week", "month", "quarter", "year"]

function formatShortRange(range: DateRange | undefined): string {
  if (!range?.from) return "Custom Range"
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  if (!range.to) return fmt(range.from)
  return `${fmt(range.from)} – ${fmt(range.to)}`
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const { company, isLoading } = useCompany()
  const [range, setRange] = useState<DateRangeKey>("week")
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [isCustom, setIsCustom] = useState(false)

  // Derive CustomDateRange for KPI queries when a valid custom range is active
  const customRange: CustomDateRange | undefined =
    isCustom && customDateRange?.from && customDateRange?.to
      ? { from: customDateRange.from, to: customDateRange.to }
      : undefined

  function handlePresetClick(key: DateRangeKey) {
    setRange(key)
    setIsCustom(false)
    setCustomDateRange(undefined)
  }

  function handleDateSelect(selected: DateRange | undefined) {
    setCustomDateRange(selected)
    if (selected?.from && selected?.to) {
      setIsCustom(true)
      setPickerOpen(false)
    }
  }

  const dateLabel = isCustom
    ? formatShortRange(customDateRange)
    : formatDateRangeLabel(range)

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-background pt-14 lg:pt-0">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold text-foreground leading-snug">
                {isLoading ? "Dashboard" : (company?.name || "Dashboard")}
              </h1>
            </div>
            <p className="text-[12.5px] text-muted-foreground mt-0.5">
              {getGreeting()} — {company?.location || "here's your business overview"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </header>

      <div className="px-5 py-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">

        {/* ── Date Range Selector ─────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset pills */}
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-sm">
            {dateRangeKeys.map((key) => (
              <button
                key={key}
                onClick={() => handlePresetClick(key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[12px] font-semibold transition-all",
                  !isCustom && range === key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {dateRangeButtonLabels[key]}
              </button>
            ))}
          </div>

          {/* Custom range picker */}
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-[7px] text-[12px] font-medium transition-all shadow-sm",
                  isCustom
                    ? "border-blue-500/50 bg-blue-600/10 text-blue-700 dark:text-blue-300"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isCustom ? dateLabel : "Custom"}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", pickerOpen && "rotate-180")} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0" sideOffset={8}>
              <div className="p-3 border-b border-border">
                <p className="text-[12px] font-semibold text-foreground">Custom Date Range</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {customDateRange?.from && customDateRange?.to
                    ? formatShortRange(customDateRange)
                    : "Select a start and end date"}
                </p>
              </div>
              <Calendar
                mode="range"
                selected={customDateRange}
                onSelect={handleDateSelect}
                numberOfMonths={1}
                disabled={{ after: new Date() }}
              />
              {customDateRange?.from && !customDateRange?.to && (
                <div className="px-3 pb-3 pt-1">
                  <p className="text-[11px] text-muted-foreground">Now select an end date</p>
                </div>
              )}
              {isCustom && (
                <div className="p-3 border-t border-border">
                  <button
                    onClick={() => { setIsCustom(false); setCustomDateRange(undefined); setPickerOpen(false) }}
                    className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear custom range
                  </button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Active range label */}
          <span className="text-[12px] text-muted-foreground hidden sm:block">
            {isCustom ? dateLabel : formatDateRangeLabel(range)}
          </span>
        </div>

        {/* ── KPI Cards ──────────────────────────────────────────────── */}
        <DashboardKPIs range={range} customRange={customRange} isCustom={isCustom} />

        {/* ── Main Grid ──────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <NeedsActionPanel />
          </div>
          <div className="lg:col-span-1">
            <ScheduleOverview />
          </div>
          <div className="lg:col-span-1">
            <RecentActivityFeed />
          </div>
        </div>

        {/* ── Performance ────────────────────────────────────────────── */}
        <PerformanceMetrics range={range} customRange={customRange} isCustom={isCustom} />

      </div>
    </div>
  )
}
