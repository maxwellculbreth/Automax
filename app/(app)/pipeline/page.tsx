"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/pipeline/kanban-board"
import { useLeads, useUpdateLead } from "@/hooks/use-data"
import { type Lead, type CanonicalLeadStatus, formatCurrency, getStatusLabel, normalizeStatus, isScheduledStatus, isCompletedStatus } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const services = [
  "Driveway + Patio",
  "Full House Wash",
  "Commercial Storefront",
  "Fence + Deck",
  "Pool Deck",
]

export default function PipelinePage() {
  const { leads, isLoading, mutate: mutateLeads } = useLeads()
  const { updateLead } = useUpdateLead()
  const [serviceFilter, setServiceFilter] = useState<string[]>([])

  const filteredLeads =
    serviceFilter.length > 0
      ? leads.filter((lead) => serviceFilter.includes(lead.service || ""))
      : leads

  // All leads go into the pipeline (including lost for visibility)
  const pipelineLeads = filteredLeads

  const handleDragEnd = async (leadId: string, newStatus: CanonicalLeadStatus) => {
    const lead = leads.find(l => l.id === leadId)
    const leadName = lead?.name || "Lead"
    
    try {
      // If moving to completed, also set completed_at timestamp
      const updates: { status: CanonicalLeadStatus; completed_at?: string } = { status: newStatus }
      if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString()
      }
      
      const result = await updateLead({ id: leadId, updates })
      if (result) {
        toast.success(`Status updated to ${getStatusLabel(newStatus)}`, {
          description: `${leadName} moved to ${getStatusLabel(newStatus)}`,
          duration: 2000,
        })
      } else {
        toast.error("Failed to update status", {
          description: "Please try again",
        })
      }
      mutateLeads()
    } catch (error) {
      toast.error("Failed to update status", {
        description: "An error occurred",
      })
    }
  }

  const toggleServiceFilter = (service: string) => {
    setServiceFilter((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    )
  }

  const totalValue = pipelineLeads.reduce(
    (sum, lead) => sum + (lead.estimated_value || 0),
    0
  )

  // Scheduled + Completed value (using normalized status)
  const scheduledValue = pipelineLeads
    .filter((lead) => isScheduledStatus(lead.status) || isCompletedStatus(lead.status))
    .reduce((sum, lead) => sum + (lead.estimated_value || 0), 0)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background pt-14 lg:pt-0">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-[13px] text-muted-foreground">Loading pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 px-4 sm:px-6 py-3">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Pipeline</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
              <span className="text-[12px] sm:text-[13px] text-muted-foreground">
                {pipelineLeads.length} active
              </span>
              <span className="text-muted-foreground hidden sm:inline">·</span>
              <span className="text-[12px] sm:text-[13px] text-muted-foreground">
                {formatCurrency(totalValue)} total
              </span>
              <span className="text-muted-foreground hidden sm:inline">·</span>
              <span className="text-[12px] sm:text-[13px] text-emerald-600 dark:text-emerald-400 font-medium">
                {formatCurrency(scheduledValue)} scheduled/completed
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-8 text-[13px]",
                    serviceFilter.length > 0 && "border-foreground"
                  )}
                >
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  Filter
                  {serviceFilter.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-foreground px-1.5 text-[10px] text-background">
                      {serviceFilter.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-[12px]">Filter by Service</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {services.map((service) => (
                  <DropdownMenuCheckboxItem
                    key={service}
                    checked={serviceFilter.includes(service)}
                    onCheckedChange={() => toggleServiceFilter(service)}
                    className="text-[13px]"
                  >
                    {service}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-8 text-[13px]">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Lead
            </Button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <KanbanBoard leads={pipelineLeads} onDragEnd={handleDragEnd} />
      </div>
    </div>
  )
}
