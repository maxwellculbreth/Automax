"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useFinanceData } from "@/hooks/use-data"
import { formatCurrency } from "@/lib/data-service"
import {
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Banknote,
  CalendarCheck,
  Percent,
  Receipt,
  Loader2,
} from "lucide-react"

const RANGES = [
  { value: "this-week",    label: "This Week" },
  { value: "this-month",   label: "This Month" },
  { value: "last-30",      label: "Last 30 Days" },
  { value: "this-quarter", label: "This Quarter" },
  { value: "ytd",          label: "Year to Date" },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultRange?: string
}

export function ProfitReportModal({ open, onOpenChange, defaultRange = "this-month" }: Props) {
  const [range, setRange] = useState(defaultRange)
  const { financeData, isLoading } = useFinanceData(range)

  const rangeLabel = RANGES.find(r => r.value === range)?.label ?? range

  // ── CSV Export ──────────────────────────────────────────────────────────────
  const downloadCSV = () => {
    if (!financeData) return

    const lines: string[] = [
      `Automax Profit Report — ${rangeLabel}`,
      `Generated: ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`,
      "",
      "SUMMARY",
      `Total Revenue,$${financeData.totalRevenue.toFixed(2)}`,
      `Scheduled Revenue,$${financeData.scheduledRevenue.toFixed(2)}`,
      `Collected Revenue,$${financeData.collectedRevenue.toFixed(2)}`,
      `Total Expenses,$${financeData.totalExpenses.toFixed(2)}`,
      `Net Profit,$${financeData.grossProfit.toFixed(2)}`,
      `Profit Margin,${financeData.profitMargin}%`,
      `Avg Job Size,$${financeData.avgJobSize.toFixed(2)}`,
      `Jobs in Period,${financeData.jobCount}`,
      "",
    ]

    if (financeData.revenueByService.length) {
      lines.push("REVENUE BY SERVICE")
      lines.push("Service,Revenue,Jobs,Avg Job")
      financeData.revenueByService.forEach(s => {
        lines.push(`${s.service},$${s.revenue.toFixed(2)},${s.jobs},$${s.avgJob.toFixed(2)}`)
      })
      lines.push("")
    }

    if (financeData.expensesByCategory.length) {
      lines.push("EXPENSES BY CATEGORY")
      lines.push("Category,Amount,Count")
      financeData.expensesByCategory.forEach(c => {
        lines.push(`${c.label},$${c.amount.toFixed(2)},${c.count}`)
      })
      lines.push("")
    }

    if (financeData.periodTransactions.length) {
      lines.push("TRANSACTIONS")
      lines.push("Date,Type,Source,Client,Category,Description,Amount,Status,Payment Method")
      financeData.periodTransactions.forEach(t => {
        const date = new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        lines.push([
          date,
          t.type === "income" ? "Income" : "Expense",
          t.source_type === "manual" ? "Manual" : "Synced",
          t.client || "",
          t.category || "",
          t.description || "",
          t.amount.toFixed(2),
          t.status || "",
          t.payment_method || "",
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
      })
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `automax-profit-report-${range}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Print isolated report content in a new window — avoids printing the whole app
  const handlePrint = () => {
    if (!financeData) return
    const el = document.getElementById("profit-report-printable")
    if (!el) return
    const w = window.open("", "_blank", "width=900,height=700")
    if (!w) return
    w.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Profit Report — ${rangeLabel}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #fff; color: #111; padding: 40px 48px; font-size: 13px; line-height: 1.5; }
    h1 { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 13px; margin-bottom: 28px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
    .kpi { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #888; font-weight: 600; margin-bottom: 4px; }
    .kpi-value { font-size: 20px; font-weight: 700; color: #111; }
    .kpi-value.green { color: #059669; }
    .kpi-value.red { color: #dc2626; }
    .kpi-value.blue { color: #2563eb; }
    .kpi-value.violet { color: #7c3aed; }
    .callout { border-radius: 12px; padding: 18px 20px; margin-bottom: 28px; display: flex; align-items: center; gap: 16px; }
    .callout.profit { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .callout.loss { background: #fef2f2; border: 1px solid #fecaca; }
    .callout-icon { font-size: 24px; }
    .callout-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #888; font-weight: 600; }
    .callout-value { font-size: 28px; font-weight: 800; margin: 2px 0; }
    .callout-value.green { color: #059669; }
    .callout-value.red { color: #dc2626; }
    .callout-meta { font-size: 12px; color: #666; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #555; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f9fafb; }
    th { text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #888; }
    th.right { text-align: right; }
    td { padding: 8px 12px; font-size: 13px; border-top: 1px solid #f0f0f0; }
    td.right { text-align: right; font-variant-numeric: tabular-nums; }
    td.green { color: #059669; font-weight: 600; }
    .bar-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 12px; }
    .bar-wrap { height: 6px; background: #f0f0f0; border-radius: 4px; overflow: hidden; margin-bottom: 12px; }
    .bar-fill { height: 100%; background: #dc2626; border-radius: 4px; }
    .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #bbb; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 20px 28px; }
      .kpi-grid { break-inside: avoid; }
      .section { break-inside: avoid; }
      @page { margin: 1cm; size: A4; }
    }
  </style>
</head>
<body>
  <h1>Profit Report</h1>
  <div class="subtitle">${rangeLabel} &nbsp;·&nbsp; Generated ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</div>
  ${el.innerHTML}
  <div class="footer">
    <span>Automax CRM</span>
    <span>Confidential — for internal use only</span>
  </div>
</body>
</html>`)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 400)
  }

  const kpis = financeData ? [
    { label: "Total Revenue",      value: formatCurrency(financeData.totalRevenue),    icon: DollarSign,   color: "text-emerald-400",   bg: "bg-emerald-500/10" },
    { label: "Scheduled",          value: formatCurrency(financeData.scheduledRevenue), icon: CalendarCheck, color: "text-blue-400",      bg: "bg-blue-500/10" },
    { label: "Collected",          value: formatCurrency(financeData.collectedRevenue), icon: Banknote,     color: "text-emerald-400",   bg: "bg-emerald-500/10" },
    { label: "Total Expenses",     value: formatCurrency(financeData.totalExpenses),   icon: CreditCard,   color: "text-red-400",       bg: "bg-red-500/10" },
    { label: "Net Profit",         value: formatCurrency(financeData.grossProfit),     icon: TrendingUp,   color: financeData.grossProfit >= 0 ? "text-emerald-400" : "text-red-400", bg: financeData.grossProfit >= 0 ? "bg-emerald-500/10" : "bg-red-500/10" },
    { label: "Profit Margin",      value: `${financeData.profitMargin}%`,              icon: Percent,      color: financeData.profitMargin >= 50 ? "text-emerald-400" : "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Avg Job Size",       value: formatCurrency(financeData.avgJobSize),      icon: Receipt,      color: "text-violet-400",    bg: "bg-violet-500/10" },
    { label: "Jobs",               value: String(financeData.jobCount),                icon: CalendarCheck, color: "text-blue-400",     bg: "bg-blue-500/10" },
  ] : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <DialogTitle className="text-[15px] font-bold">Profit Report</DialogTitle>
            <div className="flex items-center gap-2">
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="h-8 w-[150px] text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RANGES.map(r => (
                    <SelectItem key={r.value} value={r.value} className="text-[12px]">{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-[12px]"
                onClick={handlePrint}
                disabled={!financeData}
              >
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                Print
              </Button>
              <Button
                size="sm"
                className="h-8 text-[12px] bg-blue-600 hover:bg-blue-700 text-white"
                onClick={downloadCSV}
                disabled={!financeData}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download CSV
              </Button>
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground mt-1">{rangeLabel}</p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : financeData ? (
          <div id="profit-report-printable" className="space-y-5 pt-1">
            {/* KPI Grid */}
            <div className="kpi-grid grid grid-cols-2 sm:grid-cols-4 gap-3">
              {kpis.map(k => (
                <div key={k.label} className="kpi rounded-lg border border-border bg-card p-3.5">
                  <div className={cn("h-7 w-7 rounded-md flex items-center justify-center mb-2", k.bg)}>
                    <k.icon className={cn("h-3.5 w-3.5", k.color)} />
                  </div>
                  <p className="kpi-label text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{k.label}</p>
                  <p className={cn("kpi-value text-[15px] font-bold tabular-nums mt-0.5",
                    k.color === "text-emerald-400" ? "green" : k.color === "text-red-400" ? "red" : k.color === "text-blue-400" ? "blue" : "",
                    k.color
                  )}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* Profit / Loss callout */}
            <div className={cn(
              "callout rounded-xl border p-4 flex items-center gap-4",
              financeData.grossProfit >= 0 ? "profit border-emerald-500/30 bg-emerald-500/5" : "loss border-red-500/30 bg-red-500/5"
            )}>
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                financeData.grossProfit >= 0 ? "bg-emerald-500/15" : "bg-red-500/15"
              )}>
                {financeData.grossProfit >= 0
                  ? <TrendingUp className="h-5 w-5 text-emerald-400" />
                  : <TrendingDown className="h-5 w-5 text-red-400" />}
              </div>
              <div>
                <p className="callout-label text-[12px] text-muted-foreground font-medium uppercase tracking-wide">Net Profit / Loss</p>
                <p className={cn(
                  "callout-value text-2xl font-bold tabular-nums",
                  financeData.grossProfit >= 0 ? "green text-emerald-400" : "red text-red-400"
                )}>
                  {financeData.grossProfit < 0 ? "-" : "+"}{formatCurrency(Math.abs(financeData.grossProfit))}
                </p>
                <p className="callout-meta text-[12px] text-muted-foreground mt-0.5">
                  {financeData.profitMargin}% margin · {financeData.jobCount} job{financeData.jobCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Revenue by Service */}
            {financeData.revenueByService.length > 0 && (
              <div className="section rounded-lg border border-border bg-card overflow-hidden">
                <div className="section-title px-4 py-3 border-b border-border">
                  <h3 className="text-[13px] font-semibold text-foreground">Revenue by Service</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="text-left px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Service</th>
                      <th className="right text-right px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Revenue</th>
                      <th className="right text-right px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Jobs</th>
                      <th className="right text-right px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Avg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {financeData.revenueByService.map(s => (
                      <tr key={s.service}>
                        <td className="px-4 py-2.5 text-[13px] text-foreground">{s.service}</td>
                        <td className="right green px-4 py-2.5 text-[13px] font-medium text-emerald-400 text-right tabular-nums">{formatCurrency(s.revenue)}</td>
                        <td className="right px-4 py-2.5 text-[13px] text-muted-foreground text-right">{s.jobs}</td>
                        <td className="right px-4 py-2.5 text-[13px] text-foreground text-right tabular-nums">{formatCurrency(s.avgJob)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Expense Breakdown */}
            {financeData.expensesByCategory.length > 0 && (
              <div className="section rounded-lg border border-border bg-card overflow-hidden">
                <div className="section-title px-4 py-3 border-b border-border">
                  <h3 className="text-[13px] font-semibold text-foreground">Expense Breakdown</h3>
                </div>
                <div className="p-4 space-y-3">
                  {financeData.expensesByCategory.map(cat => {
                    const pct = financeData.totalExpenses > 0
                      ? Math.round((cat.amount / financeData.totalExpenses) * 100)
                      : 0
                    return (
                      <div key={cat.category}>
                        <div className="bar-row flex justify-between text-[12px] mb-1">
                          <span className="text-foreground font-medium">{cat.label}</span>
                          <span className="text-muted-foreground tabular-nums">
                            {formatCurrency(cat.amount)} ({pct}%)
                          </span>
                        </div>
                        <div className="bar-wrap h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="bar-fill h-full rounded-full bg-red-500/60" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-[13px] text-muted-foreground py-8">No data for this period.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
