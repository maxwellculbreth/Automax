"use client"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { Automation } from "@/lib/data-service"
import {
  Phone,
  MessageSquare,
  FileText,
  Star,
  RotateCcw,
  Settings,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AutomationCardProps {
  automation: Automation
  onToggle: () => void
  onEdit: () => void
}

const iconMap = {
  missed_call: Phone,
  new_lead: MessageSquare,
  quote_follow_up: FileText,
  review_request: Star,
  reactivation: RotateCcw,
}

export function AutomationCard({
  automation,
  onToggle,
  onEdit,
}: AutomationCardProps) {
  const Icon = iconMap[automation.type] || MessageSquare

  return (
    <div className={cn(
      "flex items-center gap-2 sm:gap-4 rounded-lg border bg-card px-3 sm:px-4 py-3 sm:py-4",
      automation.enabled ? "border-border" : "border-border/50 bg-secondary/20"
    )}>
      {/* Icon */}
      <div className={cn(
        "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg flex-shrink-0",
        automation.enabled ? "bg-foreground" : "bg-muted"
      )}>
        <Icon className={cn(
          "h-4 w-4 sm:h-5 sm:w-5",
          automation.enabled ? "text-background" : "text-muted-foreground"
        )} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={cn(
            "text-[13px] sm:text-[14px] font-medium truncate",
            automation.enabled ? "text-foreground" : "text-muted-foreground"
          )}>
            {automation.name}
          </h3>
          {automation.enabled ? (
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-secondary px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-muted-foreground">
              Paused
            </span>
          )}
        </div>
        <p className={cn(
          "text-[11px] sm:text-[12px] mt-0.5 line-clamp-1",
          automation.enabled ? "text-muted-foreground" : "text-muted-foreground/70"
        )}>
          {automation.description}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">Triggers</p>
          <p className="text-[14px] font-medium text-foreground tabular-nums">
            {automation.trigger_count}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">Success</p>
          <p className="text-[14px] font-medium text-foreground tabular-nums">
            {automation.trigger_count > 0 ? Math.round((automation.success_count / automation.trigger_count) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Switch 
          checked={automation.enabled} 
          onCheckedChange={onToggle}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onEdit}
          className="h-8 w-8 hidden sm:flex"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
