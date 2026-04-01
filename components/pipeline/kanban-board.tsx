"use client"

import { useState } from "react"
import {
  type Lead,
  type LeadStatus,
  type CanonicalLeadStatus,
  formatCurrency,
  formatRelativeTime,
  normalizeStatus,
} from "@/lib/data-service"
import { GripVertical, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface KanbanBoardProps {
  leads: Lead[]
  onDragEnd: (leadId: string, newStatus: CanonicalLeadStatus) => void
}

// Pipeline columns using canonical statuses
const columns: { id: CanonicalLeadStatus; label: string; dotColor: string; bgColor: string }[] = [
  { id: "new", label: "New", dotColor: "bg-blue-500", bgColor: "bg-blue-500/5 dark:bg-blue-500/10" },
  { id: "contacted", label: "Contacted", dotColor: "bg-amber-500", bgColor: "bg-amber-500/5 dark:bg-amber-500/10" },
  { id: "quoted", label: "Quoted", dotColor: "bg-violet-500", bgColor: "bg-violet-500/5 dark:bg-violet-500/10" },
  { id: "scheduled", label: "Scheduled", dotColor: "bg-emerald-500", bgColor: "bg-emerald-500/5 dark:bg-emerald-500/10" },
  { id: "completed", label: "Completed", dotColor: "bg-teal-500", bgColor: "bg-teal-500/5 dark:bg-teal-500/10" },
  { id: "lost", label: "Lost", dotColor: "bg-red-500", bgColor: "bg-red-500/5 dark:bg-red-500/10" },
]

export function KanbanBoard({ leads, onDragEnd }: KanbanBoardProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<CanonicalLeadStatus | null>(null)

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", lead.id)
  }

  const handleDragEnd = () => {
    setDraggedLead(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: CanonicalLeadStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: CanonicalLeadStatus) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData("text/plain")
    // Compare normalized status to handle legacy values
    if (leadId && draggedLead && normalizeStatus(draggedLead.status) !== columnId) {
      onDragEnd(leadId, columnId)
    }
    setDraggedLead(null)
    setDragOverColumn(null)
  }

  return (
    <div className="flex gap-4 p-4 sm:p-5 min-w-max h-full pb-4">
      {columns.map((column) => {
        // Normalize status to handle legacy values (booked → scheduled, complete → completed)
        const columnLeads = leads.filter((lead) => normalizeStatus(lead.status) === column.id)
        const columnValue = columnLeads.reduce(
          (sum, lead) => sum + (lead.estimated_value || 0),
          0
        )

        return (
          <div
            key={column.id}
            className={cn(
              "w-60 sm:w-72 flex-shrink-0 flex flex-col rounded-xl border border-border/60 shadow-sm",
              column.bgColor,
              dragOverColumn === column.id && "ring-2 ring-primary/40 border-primary/40"
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="px-4 py-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={cn("h-2.5 w-2.5 rounded-full", column.dotColor)} />
                  <span className="text-[14px] font-semibold text-foreground">{column.label}</span>
                </div>
                <span className="text-[12px] font-medium bg-background/80 px-2 py-0.5 rounded-full text-muted-foreground tabular-nums">
                  {columnLeads.length}
                </span>
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-muted-foreground tabular-nums">
                {formatCurrency(columnValue)}
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {columnLeads.length === 0 ? (
                <div className={cn(
                  "flex flex-col items-center justify-center h-24 text-[12px] text-muted-foreground",
                  "border-2 border-dashed border-border/60 rounded-lg bg-background/40",
                  "transition-colors",
                  dragOverColumn === column.id && "border-primary/50 bg-primary/5"
                )}>
                  <span className="text-muted-foreground/70">Drop here</span>
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    isDragging={draggedLead?.id === lead.id}
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface KanbanCardProps {
  lead: Lead
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
}

function KanbanCard({
  lead,
  isDragging,
  onDragStart,
  onDragEnd,
}: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-lg border border-border bg-card p-3.5 cursor-grab active:cursor-grabbing transition-all",
        "shadow-sm hover:shadow-md hover:border-border/80 hover:-translate-y-0.5",
        isDragging && "opacity-50 rotate-1 scale-[1.02] shadow-lg ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Link
            href={`/leads?id=${lead.id}`}
            className="text-[13px] font-medium text-foreground hover:underline block truncate"
          >
            {lead.name || "Unknown"}
          </Link>
          <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
            {lead.service || "Not specified"}
          </p>

          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[13px] font-semibold text-foreground tabular-nums">
              {lead.estimated_value ? formatCurrency(lead.estimated_value) : "-"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {lead.source || "Unknown"}
            </span>
          </div>

          {lead.last_contact_at && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(lead.last_contact_at)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
