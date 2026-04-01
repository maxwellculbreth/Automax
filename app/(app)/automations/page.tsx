"use client"

import { useState } from "react"
import { AutomationCard } from "@/components/automations/automation-card"
import { EditAutomationDialog } from "@/components/automations/edit-automation-dialog"
import { useAutomations, useUpdateAutomation } from "@/hooks/use-data"
import type { Automation } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Plus, Zap, TrendingUp, Clock, Loader2 } from "lucide-react"

export default function AutomationsPage() {
  const { automations, isLoading, mutate } = useAutomations()
  const { updateAutomation } = useUpdateAutomation()
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null)

  const toggleAutomation = async (id: string) => {
    const automation = automations.find((a) => a.id === id)
    if (automation) {
      await updateAutomation({ id, updates: { enabled: !automation.enabled } })
      mutate()
    }
  }

  const activeCount = automations.filter((a) => a.enabled).length
  const totalTriggers = automations.reduce((sum, a) => sum + a.trigger_count, 0)
  const avgSuccessRate = automations.length > 0
    ? Math.round(
        automations.reduce((sum, a) => sum + Math.round((a.success_count / Math.max(a.trigger_count, 1)) * 100), 0) / automations.length
      )
    : 0

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Automations</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Automated workflows that run in the background
            </p>
          </div>
          <Button size="sm" className="h-8 text-[13px] w-full sm:w-auto">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Automation
          </Button>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="rounded-lg border border-border bg-card px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
              <Zap className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              <span className="text-[11px] sm:text-[12px] font-medium">Active</span>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-semibold text-foreground tabular-nums">
              {activeCount}<span className="text-muted-foreground text-xs sm:text-sm font-normal"> / {automations.length}</span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
              <TrendingUp className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              <span className="text-[11px] sm:text-[12px] font-medium truncate">Triggers</span>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-semibold text-foreground tabular-nums">
              {totalTriggers.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
              <Clock className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              <span className="text-[11px] sm:text-[12px] font-medium truncate">Success</span>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-semibold text-foreground tabular-nums">
              {avgSuccessRate}%
            </p>
          </div>
        </div>

        {/* Automation Cards */}
        <div className="space-y-3">
          {automations.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              onToggle={() => toggleAutomation(automation.id)}
              onEdit={() => setEditingAutomation(automation)}
            />
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <EditAutomationDialog
        automation={editingAutomation}
        open={!!editingAutomation}
        onOpenChange={(open) => !open && setEditingAutomation(null)}
      />
    </div>
  )
}
