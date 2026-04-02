"use client"

import { useState } from "react"
import {
  type Lead,
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

const columns: { id: CanonicalLeadStatus; label: string; dotColor: string; accentBorder: string }[] = [
  { id: "new",       label: "New",       dotColor: "bg-blue-500",    accentBorder: "border-t-blue-500" },
  { id: "contacted", label: "Contacted", dotColor: "bg-amber-500",   accentBorder: "border-t-amber-500" },
  { id: "quoted",    label: "Quoted",    dotColor: "bg-violet-500",  accentBorder: "border-t-violet-500" },
  { id: "scheduled", label: "Scheduled", dotColor: "bg-emerald-500", accentBorder: "border-t-emerald-500" },
  { id: "completed", label: "Completed", dotColor: "bg-teal-500",    accentBorder: "border-t-teal-500" },
  { id: "lost",      label: "Lost",      dotColor: "bg-red-400",     accentBorder: "border-t-red-400" },
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
    if (leadId && draggedLead && normalizeStatus(draggedLead.status) !== columnId) {
      onDragEnd(leadId, columnId)
    }
    setDraggedLead(null)
    setDragOverColumn(null)
  }

  return (
    <div className="flex gap-3 px-5 pb-6 min-w-max items-start">
      {columns.map((column) => {
        const columnLeads = leads.filter((lead) => normalizeStatus(lead.status) === column.id)
        const columnValue = columnLeads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0)

        return (
          <div
            key={column.id}
            className={cn(
              "w-60 sm:w-64 flex-shrink-0 flex flex-col rounded-xl border border-border/60 bg-card shadow-sm border-t-2",
              column.accentBorder,
              dragOverColumn === column.id && "ring-2 ring-primary/40 border-primary/30"
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="px-4 py-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full flex-shrink-0", column.dotColor)} />
                  <span className="text-[13px] font-semibold text-foreground">{column.label}</span>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground tabular-nums bg-secondary/60 px-1.5 py-0.5 rounded-full">
                  {columnLeads.length}
                </span>
              </div>
              {columnValue > 0 && (
                <div className="mt-1 text-[12px] font-medium text-muted-foreground tabular-nums">
                  {formatCurrency(columnValue)}
                </div>
              )}
            </div>

            {/* Column Content — capped height, scrollable */}
            <div className="p-2.5 space-y-2 max-h-[420px] overflow-y-auto">
              {columnLeads.length === 0 ? (
                <div className={cn(
                  "flex items-center justify-center h-20 text-[12px] text-muted-foreground/60",
                  "border-2 border-dashed border-border/50 rounded-lg",
                  dragOverColumn === column.id && "border-primary/40 bg-primary/5"
                )}>
                  Drop here
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

function KanbanCard({ lead, isDragging, onDragStart, onDragEnd }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-lg border border-border bg-card p-3 cursor-grab active:cursor-grabbing",
        "shadow-sm hover:shadow-md hover:border-border/80 transition-all",
        isDragging && "opacity-40 scale-[1.02] shadow-lg ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Link
            href={`/leads?id=${lead.id}`}
            className="text-[13px] font-semibold text-foreground hover:underline block truncate leading-tight"
          >
            {lead.name || "Unknown"}
          </Link>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {lead.service || "No service"}
          </p>

          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[14px] font-bold text-foreground tabular-nums">
              {lead.estimated_value ? formatCurrency(lead.estimated_value) : "—"}
            </span>
            {lead.source && (
              <span className="text-[10px] font-medium text-muted-foreground/70 bg-secondary/60 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">
                {lead.source}
              </span>
            )}
          </div>

          {lead.last_contact_at && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground/70">
              <Clock className="h-2.5 w-2.5" />
              {formatRelativeTime(lead.last_contact_at)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
