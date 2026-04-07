"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUrgentItems } from "@/hooks/use-data"
import { AlertCircle, ChevronRight, Clock, FileText, UserPlus, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  new_lead: UserPlus,
  follow_up_due: Clock,
  quote_stale: FileText,
}

const priorityStyles = {
  high: "border-l-red-500 dark:border-l-red-400",
  medium: "border-l-amber-500 dark:border-l-amber-400",
  low: "border-l-slate-400 dark:border-l-slate-500",
}

export function NeedsActionPanel() {
  const { items: urgentItems, isLoading } = useUrgentItems()

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <h3 className="text-[13px] font-semibold text-foreground">Needs Action</h3>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 animate-pulse">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="mt-1.5 h-3 w-48 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (urgentItems.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <h3 className="text-[13px] font-semibold text-foreground">Needs Action</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center px-5">
          <div className="rounded-full bg-emerald-500/10 p-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-3 text-[13px] font-medium text-foreground">All caught up</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            No urgent items right now
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Needs Action</h3>
        </div>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/15 px-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
          {urgentItems.length}
        </span>
      </div>
      <div className="divide-y divide-border">
        {urgentItems.map((item) => {
          const Icon = iconMap[item.type as keyof typeof iconMap] || AlertCircle
          const priorityStyle = priorityStyles[item.priority as keyof typeof priorityStyles] || priorityStyles.low
          
          return (
            <Link
              key={item.id}
              href={`/leads?id=${item.leadId}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40 border-l-2",
                priorityStyle
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">
                  {item.title}
                </p>
                <p className="text-[12px] text-muted-foreground truncate mt-1">
                  {item.subtitle}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </Link>
          )
        })}
      </div>
      <div className="border-t border-border p-3">
        <Button variant="ghost" size="sm" className="w-full text-[12px] h-8 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/leads">View all leads</Link>
        </Button>
      </div>
    </div>
  )
}
