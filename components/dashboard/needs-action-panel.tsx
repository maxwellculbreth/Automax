"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUrgentItems } from "@/hooks/use-data"
import { AlertCircle, ChevronRight, Clock, FileText, UserPlus, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  new_lead:      UserPlus,
  follow_up_due: Clock,
  quote_stale:   FileText,
}

const priorityConfig = {
  high: {
    border:   "border-l-red-500 dark:border-l-red-400",
    dot:      "bg-red-500",
    badge:    "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  medium: {
    border:   "border-l-amber-500 dark:border-l-amber-400",
    dot:      "bg-amber-500",
    badge:    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  low: {
    border:   "border-l-slate-400 dark:border-l-slate-500",
    dot:      "bg-slate-400",
    badge:    "bg-slate-500/10 text-slate-500 dark:text-slate-400",
  },
}

export function NeedsActionPanel() {
  const { items: urgentItems, isLoading } = useUrgentItems()

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <h3 className="text-[13px] font-semibold text-foreground">Needs Action</h3>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 animate-pulse space-y-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-48 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (urgentItems.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Needs Action</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-3 text-[13px] font-semibold text-foreground">All caught up</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            No urgent items right now
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
          </div>
          <h3 className="text-[13px] font-semibold text-foreground">Needs Action</h3>
        </div>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/15 px-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          {urgentItems.length}
        </span>
      </div>

      <div className="divide-y divide-border flex-1">
        {urgentItems.map((item) => {
          const Icon = iconMap[item.type as keyof typeof iconMap] || AlertCircle
          const pCfg = priorityConfig[item.priority as keyof typeof priorityConfig] || priorityConfig.low

          return (
            <Link
              key={item.id}
              href={`/leads?id=${item.leadId}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40 border-l-[3px] group",
                pCfg.border
              )}
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                <Icon className={cn("h-3.5 w-3.5", pCfg.badge.split(" ")[1])} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate group-hover:text-foreground">
                  {item.title}
                </p>
                <p className="text-[11.5px] text-muted-foreground truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/60 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
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
