"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useFinanceData, useActivities } from "@/hooks/use-data"
import { formatCurrency, formatRelativeTime } from "@/lib/data-service"
import {
  Plus,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Percent,
  CalendarCheck,
  Banknote,
  Receipt,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Lightbulb,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Zap,
  Building,
  Truck,
  Droplets,
  Home,
  Wrench,
  Loader2,
} from "lucide-react"

// Date range options
const dateRanges = [
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "last-30", label: "Last 30 Days" },
  { value: "this-quarter", label: "This Quarter" },
  { value: "ytd", label: "Year to Date" },
]

// Finance KPIs
const financeKPIs = [
  { key: "revenue", label: "Total Revenue", value: 18450, trend: "+12%", trendUp: true, prefix: "$", icon: DollarSign },
  { key: "expenses", label: "Total Expenses", value: 4920, trend: "+5%", trendUp: false, prefix: "$", icon: CreditCard },
  { key: "profit", label: "Gross Profit", value: 13530, trend: "+15%", trendUp: true, prefix: "$", icon: PiggyBank },
  { key: "margin", label: "Profit Margin", value: 73, trend: "+3%", trendUp: true, suffix: "%", icon: Percent },
  { key: "booked", label: "Booked Revenue", value: 7800, trend: "This period", trendUp: null, prefix: "$", icon: CalendarCheck },
  { key: "collected", label: "Collected Revenue", value: 15200, trend: "+18%", trendUp: true, prefix: "$", icon: Banknote },
  { key: "avgJob", label: "Avg Job Size", value: 412, trend: "+$24", trendUp: true, prefix: "$", icon: Receipt },
  { key: "outstanding", label: "Outstanding", value: 3250, trend: "4 invoices", trendUp: false, prefix: "$", icon: AlertCircle },
]

// Monthly revenue/expense data for chart
const monthlyData = [
  { month: "Jan", revenue: 12400, expenses: 3200, profit: 9200 },
  { month: "Feb", revenue: 14800, expenses: 3800, profit: 11000 },
  { month: "Mar", revenue: 16200, expenses: 4100, profit: 12100 },
  { month: "Apr", revenue: 18450, expenses: 4920, profit: 13530 },
]

// Transactions data
const transactions = [
  { id: 1, date: "Apr 1", type: "income", category: "Job Payment", description: "Driveway + Patio", client: "Sarah Mitchell", amount: 325, status: "paid" },
  { id: 2, date: "Apr 1", type: "expense", category: "Chemicals", description: "SH + surfactant restock", client: null, amount: 92, status: "cleared" },
  { id: 3, date: "Mar 31", type: "expense", category: "Gas", description: "Trailer + machine fuel", client: null, amount: 48, status: "cleared" },
  { id: 4, date: "Mar 31", type: "income", category: "Job Payment", description: "Full House Wash", client: "Daniel Culbreth", amount: 350, status: "paid" },
  { id: 5, date: "Mar 30", type: "expense", category: "Marketing", description: "Facebook ads", client: null, amount: 125, status: "pending" },
  { id: 6, date: "Mar 30", type: "income", category: "Job Payment", description: "Roof Soft Wash", client: "Amanda Torres", amount: 575, status: "paid" },
  { id: 7, date: "Mar 29", type: "expense", category: "Equipment", description: "Pressure washer parts", client: null, amount: 185, status: "cleared" },
  { id: 8, date: "Mar 29", type: "income", category: "Job Payment", description: "Commercial Cleaning", client: "Peak Fitness Gym", amount: 890, status: "paid" },
  { id: 9, date: "Mar 28", type: "expense", category: "Insurance", description: "Monthly premium", client: null, amount: 245, status: "cleared" },
  { id: 10, date: "Mar 28", type: "income", category: "Job Payment", description: "Window Cleaning", client: "Robert Chen", amount: 280, status: "pending" },
]

// Expense categories
const expenseCategories = [
  { name: "Chemicals", amount: 892, percent: 18, icon: Droplets, color: "bg-blue-500" },
  { name: "Gas", amount: 645, percent: 13, icon: Truck, color: "bg-amber-500" },
  { name: "Marketing", amount: 1250, percent: 25, icon: BarChart3, color: "bg-violet-500" },
  { name: "Payroll", amount: 1200, percent: 24, icon: Building, color: "bg-emerald-500" },
  { name: "Equipment", amount: 485, percent: 10, icon: Wrench, color: "bg-orange-500" },
  { name: "Software", amount: 198, percent: 4, icon: Zap, color: "bg-pink-500" },
  { name: "Insurance", amount: 250, percent: 5, icon: AlertCircle, color: "bg-slate-500" },
]

// Service revenue breakdown
const serviceRevenue = [
  { service: "House Wash", revenue: 6250, jobs: 14, avgJob: 446, margin: 78 },
  { service: "Driveway Cleaning", revenue: 4890, jobs: 18, avgJob: 272, margin: 82 },
  { service: "Roof Wash", revenue: 3480, jobs: 5, avgJob: 696, margin: 71 },
  { service: "Window Cleaning", revenue: 2280, jobs: 9, avgJob: 253, margin: 85 },
  { service: "Commercial", revenue: 1550, jobs: 2, avgJob: 775, margin: 68 },
]

// Recent financial activity
const financialActivity = [
  { id: 1, type: "payment", message: "Job payment received for $350", time: "2 hours ago", icon: DollarSign },
  { id: 2, type: "expense", message: "Expense logged: Facebook ads $125", time: "5 hours ago", icon: CreditCard },
  { id: 3, type: "reminder", message: "Outstanding invoice reminder for Sarah Mitchell", time: "1 day ago", icon: AlertCircle },
  { id: 4, type: "insight", message: "Gross profit increased 8% this month", time: "1 day ago", icon: TrendingUp },
  { id: 5, type: "trend", message: "New expense category trend detected: chemicals", time: "2 days ago", icon: PieChart },
]

// AI insights
const aiInsights = [
  { priority: "high", message: "Your marketing spend is up 18% this month. Consider reviewing ROI.", icon: BarChart3 },
  { priority: "medium", message: "Driveway cleaning has the highest margin this month at 82%.", icon: TrendingUp },
  { priority: "high", message: "Outstanding payments total $3,250 — follow up with 4 clients.", icon: AlertCircle },
  { priority: "low", message: "Software costs are low relative to revenue (1.1%).", icon: CheckCircle2 },
  { priority: "medium", message: "Average job value is trending upward (+$24 vs last month).", icon: ArrowUpRight },
]

// Quick actions
const quickActions = [
  { label: "Add Expense", icon: CreditCard },
  { label: "Add Income", icon: DollarSign },
  { label: "Export CSV", icon: Download },
  { label: "View Profit Report", icon: FileText },
  { label: "Mark Payment Collected", icon: CheckCircle2 },
]

export default function FinancePage() {
  const [dateRange, setDateRange] = useState("this-month")
  const { financeData, isLoading } = useFinanceData(dateRange)
  const { activities } = useActivities(10)
  const [transactionFilter, setTransactionFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Build dynamic KPIs from real data
  // Total Revenue = Scheduled + Completed leads
  // Scheduled Revenue = leads with status = "scheduled" (booked but not completed)
  // Collected Revenue = leads with status = "completed"
  const dynamicKPIs = financeData ? [
    { key: "revenue", label: "Total Revenue", value: financeData.totalRevenue, trend: `${financeData.jobCount} jobs`, trendUp: true, prefix: "$", icon: DollarSign },
    { key: "scheduled", label: "Scheduled", value: financeData.scheduledRevenue, trend: `${financeData.leadsByStatus.scheduled || 0} scheduled`, trendUp: null, prefix: "$", icon: CalendarCheck },
    { key: "collected", label: "Collected", value: financeData.collectedRevenue, trend: `${financeData.leadsByStatus.completed || 0} completed`, trendUp: true, prefix: "$", icon: Banknote },
    { key: "avgJob", label: "Avg Job Size", value: financeData.avgJobSize, trend: "Per job", trendUp: true, prefix: "$", icon: Receipt },
    { key: "outstanding", label: "Outstanding", value: financeData.outstandingAmount, trend: `${financeData.outstandingCount} jobs`, trendUp: false, prefix: "$", icon: AlertCircle },
    { key: "newLeads", label: "New Leads", value: financeData.leadsByStatus.new || 0, trend: "In pipeline", trendUp: null, prefix: "", icon: TrendingUp },
    { key: "quoted", label: "Quoted", value: financeData.leadsByStatus.quoted || 0, trend: "Awaiting decision", trendUp: null, prefix: "", icon: FileText },
    { key: "lost", label: "Lost", value: financeData.leadsByStatus.lost || 0, trend: "This period", trendUp: false, prefix: "", icon: XCircle },
  ] : financeKPIs

  // Use real service revenue data
  const dynamicServiceRevenue = financeData?.revenueByService.length 
    ? financeData.revenueByService.map(s => ({ ...s, margin: 75 })) // Default margin since we don't track expenses per service
    : serviceRevenue

  // Use real activities
  const dynamicActivity = activities.length > 0 
    ? activities.slice(0, 5).map((a, i) => ({
        id: i,
        type: a.type,
        message: a.description,
        time: formatRelativeTime(a.created_at),
        icon: a.type === "job_booked" ? DollarSign : a.type === "quote_updated" ? FileText : Clock,
      }))
    : financialActivity

  // Generate dynamic AI insights based on real data
  const dynamicInsights = financeData ? [
    financeData.outstandingCount > 0 && { 
      priority: "high", 
      message: `Outstanding payments total ${formatCurrency(financeData.outstandingAmount)} — follow up with ${financeData.outstandingCount} clients.`, 
      icon: AlertCircle 
    },
    financeData.leadsByStatus.new > 3 && { 
      priority: "medium", 
      message: `You have ${financeData.leadsByStatus.new} new leads awaiting response. Quick follow-up improves conversion.`, 
      icon: TrendingUp 
    },
    financeData.avgJobSize > 0 && { 
      priority: "low", 
      message: `Average job value is ${formatCurrency(financeData.avgJobSize)}. Consider upselling to increase this.`, 
      icon: ArrowUpRight 
    },
    financeData.revenueByService[0] && { 
      priority: "medium", 
      message: `${financeData.revenueByService[0].service} is your top earner at ${formatCurrency(financeData.revenueByService[0].revenue)}.`, 
      icon: BarChart3 
    },
    financeData.leadsByStatus.quoted > 2 && { 
      priority: "high", 
      message: `${financeData.leadsByStatus.quoted} leads have quotes pending decision. Follow up to close deals.`, 
      icon: FileText 
    },
  ].filter(Boolean) as typeof aiInsights : aiInsights

  const allTransactions = financeData?.periodTransactions ?? []
  const filteredTransactions = allTransactions.filter((t) => {
    if (transactionFilter === "expenses") return false // no expense data yet
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.client.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background pt-14 lg:pt-0">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-[13px] text-muted-foreground">Loading finance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Finance</h1>
            <p className="text-[13px] text-muted-foreground">
              Track revenue, expenses, profit, and business performance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value} className="text-[13px]">
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="h-9 text-[13px] flex-1 sm:flex-none">
                <Download className="h-4 w-4 mr-1.5" />
                Export Report
              </Button>
              <Button size="sm" className="h-9 text-[13px] flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 py-5 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-8">
          {dynamicKPIs.map((kpi) => (
            <div key={kpi.key} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                  <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {kpi.label}
              </p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums tracking-tight leading-none text-foreground">
                {kpi.prefix}{kpi.value.toLocaleString()}{kpi.suffix}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {kpi.trendUp !== null && (
                  kpi.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  )
                )}
                <span className={cn(
                  "text-[11px] leading-none",
                  kpi.trendUp === true && "text-emerald-600 dark:text-emerald-400",
                  kpi.trendUp === false && "text-amber-600 dark:text-amber-400",
                  kpi.trendUp === null && "text-muted-foreground"
                )}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue vs Expenses + Profit Breakdown */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Revenue vs Expenses Chart */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[14px] font-semibold text-foreground">Revenue vs Expenses</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Monthly comparison of revenue, expenses, and profit
              </p>
            </div>
            <div className="p-5">
              {/* Chart visualization */}
              <div className="space-y-4">
                {(financeData?.chartData ?? []).length === 0 ? (
                  <p className="text-center text-[13px] text-muted-foreground py-6">No revenue data for this period.</p>
                ) : (financeData?.chartData ?? []).map((bar) => {
                  const maxVal = Math.max(...(financeData?.chartData ?? []).map(b => b.revenue), 1)
                  const profit = bar.revenue - bar.expenses
                  return (
                    <div key={bar.label} className="space-y-2">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium text-foreground">{bar.label}</span>
                        <span className="text-muted-foreground">
                          Revenue: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(profit)}</span>
                        </span>
                      </div>
                      <div className="flex gap-1 h-8">
                        <div
                          className="bg-primary/80 rounded-l-md flex items-center justify-center min-w-[2px]"
                          style={{ width: `${Math.max((bar.revenue / maxVal) * 85, bar.revenue > 0 ? 4 : 0)}%` }}
                        >
                          {bar.revenue > 0 && (
                            <span className="text-[10px] font-medium text-primary-foreground px-1 truncate">
                              {bar.revenue >= 1000 ? `$${(bar.revenue / 1000).toFixed(1)}k` : `$${bar.revenue}`}
                            </span>
                          )}
                        </div>
                        {bar.expenses > 0 && (
                          <div
                            className="bg-red-500/80 dark:bg-red-500/60 rounded-r-md flex items-center justify-center"
                            style={{ width: `${(bar.expenses / maxVal) * 85}%` }}
                          >
                            <span className="text-[10px] font-medium text-white px-1">
                              {bar.expenses >= 1000 ? `$${(bar.expenses / 1000).toFixed(1)}k` : `$${bar.expenses}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-primary/80" />
                  <span className="text-[12px] text-muted-foreground">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-red-500/80 dark:bg-red-500/60" />
                  <span className="text-[12px] text-muted-foreground">Expenses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Breakdown */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[14px] font-semibold text-foreground">Profit Breakdown</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Current period summary
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-[13px] text-muted-foreground">Revenue</span>
                <span className="text-[14px] font-semibold text-foreground">{formatCurrency(financeData?.totalRevenue ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-[13px] text-muted-foreground">Expenses</span>
                <span className="text-[14px] font-semibold text-muted-foreground">
                  {financeData?.totalExpenses ? `-${formatCurrency(financeData.totalExpenses)}` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-[13px] font-medium text-foreground">Gross Profit</span>
                <span className="text-[16px] font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(financeData?.grossProfit ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-[13px] text-muted-foreground">Profit Margin</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full" style={{ width: `${financeData?.profitMargin ?? 0}%` }} />
                  </div>
                  <span className="text-[14px] font-semibold text-foreground">{financeData?.profitMargin ?? 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground">Transactions</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Recent income and expenses
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-[13px]"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Tabs value={transactionFilter} onValueChange={setTransactionFilter}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-[12px] h-6 px-3">All</TabsTrigger>
                  <TabsTrigger value="income" className="text-[12px] h-6 px-3">Income</TabsTrigger>
                  <TabsTrigger value="expenses" className="text-[12px] h-6 px-3">Expenses</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Date</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Category</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Description</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Client</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Amount</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3.5 text-[13px] text-muted-foreground whitespace-nowrap">{t.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                        t.type === "income" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      )}>
                        {t.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-foreground">{t.category}</td>
                    <td className="px-5 py-3.5 text-[13px] text-foreground">{t.description}</td>
                    <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{t.client || "—"}</td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-right tabular-nums whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(t.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                        t.status === "collected"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        {t.status === "collected" ? "Collected" : "Scheduled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border p-4 flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">
              Showing {filteredTransactions.length} of {allTransactions.length} income transactions
            </span>
            <Button variant="ghost" size="sm" className="text-[13px] h-8">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Expense Categories + Cash Flow */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Expense Categories */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[14px] font-semibold text-foreground">Expense Categories</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Breakdown by category
              </p>
            </div>
            <div className="flex flex-col items-center justify-center py-8 px-5 text-center gap-2">
              <CreditCard className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-[13px] font-medium text-foreground">No expense data yet</p>
              <p className="text-[12px] text-muted-foreground leading-snug">
                Add an expenses table to track cost breakdown by category.
              </p>
            </div>
          </div>

          {/* Cash Flow & Collections */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[14px] font-semibold text-foreground">Cash Flow & Collections</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Booked vs collected revenue
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Booked</p>
                  <p className="mt-1 text-xl font-semibold text-foreground tabular-nums">{formatCurrency(financeData?.scheduledRevenue ?? 0)}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{financeData?.outstandingCount ?? 0} upcoming jobs</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Collected</p>
                  <p className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatCurrency(financeData?.collectedRevenue ?? 0)}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">This period</p>
                </div>
              </div>
              {(financeData?.outstandingCount ?? 0) > 0 && (
                <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-[13px] font-medium text-amber-600 dark:text-amber-400">Outstanding Balance</p>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-foreground tabular-nums">{formatCurrency(financeData?.outstandingAmount ?? 0)}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{financeData?.outstandingCount} scheduled job{financeData?.outstandingCount !== 1 ? "s" : ""} not yet completed</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-[12px] font-medium text-muted-foreground">Recent Completed Jobs</p>
                {(financeData?.periodTransactions ?? []).filter(t => t.status === "collected").slice(0, 4).length === 0 ? (
                  <p className="text-[13px] text-muted-foreground py-2">No completed jobs this period.</p>
                ) : (
                  <div className="space-y-2">
                    {(financeData?.periodTransactions ?? [])
                      .filter(t => t.status === "collected")
                      .slice(0, 4)
                      .map(t => (
                        <div key={t.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-[13px] text-foreground truncate max-w-[120px]">{t.client}</span>
                          </div>
                          <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">+{formatCurrency(t.amount)}</span>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Economics */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-[14px] font-semibold text-foreground">Job Economics</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Revenue and profitability by service type
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Service</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Revenue</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Jobs</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Avg Job</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dynamicServiceRevenue.map((s) => (
                  <tr key={s.service} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-[13px] font-medium text-foreground">{s.service}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-foreground text-right tabular-nums">${s.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-[13px] text-muted-foreground text-right tabular-nums">{s.jobs}</td>
                    <td className="px-5 py-3.5 text-[13px] text-foreground text-right tabular-nums">${s.avgJob}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                        s.margin >= 80 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : s.margin >= 70
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        {s.margin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity + Quick Actions + AI Insights */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Recent Financial Activity */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[14px] font-semibold text-foreground">Recent Financial Activity</h2>
            </div>
            <div className="divide-y divide-border">
              {dynamicActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full mt-0.5",
                    activity.type === "payment" && "bg-emerald-500/10",
                    activity.type === "expense" && "bg-red-500/10",
                    activity.type === "reminder" && "bg-amber-500/10",
                    activity.type === "insight" && "bg-blue-500/10",
                    activity.type === "trend" && "bg-violet-500/10"
                  )}>
                    <activity.icon className={cn(
                      "h-3.5 w-3.5",
                      activity.type === "payment" && "text-emerald-600 dark:text-emerald-400",
                      activity.type === "expense" && "text-red-600 dark:text-red-400",
                      activity.type === "reminder" && "text-amber-600 dark:text-amber-400",
                      activity.type === "insight" && "text-blue-600 dark:text-blue-400",
                      activity.type === "trend" && "text-violet-600 dark:text-violet-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-foreground">{activity.message}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[14px] font-semibold text-foreground">Quick Actions</h2>
            </div>
            <div className="p-5 space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start h-10 text-[13px]"
                >
                  <action.icon className="h-4 w-4 mr-2.5 text-muted-foreground" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* AI Finance Insights */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-[14px] font-semibold text-foreground">AI Finance Insights</h2>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {dynamicInsights.map((insight, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3",
                    insight.priority === "high" 
                      ? "border-amber-500/30 bg-amber-500/5 dark:border-amber-500/20 dark:bg-amber-500/10"
                      : "border-border"
                  )}
                >
                  <insight.icon className={cn(
                    "h-4 w-4 flex-shrink-0 mt-0.5",
                    insight.priority === "high" 
                      ? "text-amber-600 dark:text-amber-400" 
                      : "text-muted-foreground"
                  )} />
                  <p className="text-[13px] text-foreground leading-snug">{insight.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
