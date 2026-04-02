"use client"

import { useState } from "react"
import {
  type Lead,
  type CanonicalLeadStatus,
  formatCurrency,
  formatRelativeTime,
  normalizeStatus,
} from "@/lib/data-service"
import { GripVertical, Clock, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface KanbanBoardProps {
  leads: Lead[]
  onDragEnd: (leadId: string, newStatus: CanonicalLeadStatus) => void
  onAddLead: () => void
}

const CARD_LIMIT = 3

export const KANBAN_COLUMNS: {
  id: CanonicalLeadStatus
  label: string
  dotColor: string
  accentBorder: string
  accentText: string
}[] = [
  { id: "new",       label: "New",       dotColor: "bg-blue-500",    accentBorder: "border-t-blue-500",    accentText: "text-blue-500" },
  { id: "contacted", label: "Contacted", dotColor: "bg-amber-500",   accentBorder: "border-t-amber-500",   accentText: "text-amber-500" },
  { id: "quoted",    label: "Quoted",    dotColor: "bg-violet-500",  accentBorder: "border-t-violet-500",  accentText: "text-violet-500" },
  { id: "scheduled", label: "Scheduled", dotColor: "bg-emerald-500", accentBorder: "border-t-emerald-500", accentText: "text-emerald-500" },
  { id: "completed", label: "Completed", dotColor: "bg-teal-500",    accentBorder: "border-t-teal-500",    accentText: "text-teal-500" },
  { id: "lost",      label: "Lost",      dotColor: "bg-red-400",     accentBorder: "border-t-red-400",     accentText: "text-red-400" },
]

/** Sort by recency of contact → highest value → most recently created */
function prioritizeLeads(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    const aC = a.last_contact_at ? new Date(a.last_contact_at).getTime() : 0
    const bC = b.last_contact_at ? new Date(b.last_contact_at).getTime() : 0
    if (aC !== bC) return bC - aC
    const aV = a.estimated_value ?? 0
    const bV = b.estimated_value ?? 0
    if (aV !== bV) return bV - aV
    const aT = a.created_at ? new Date(a.created_at).getTime() : 0
    const bT = b.created_at ? new Date(b.created_at).getTime() : 0
    return bT - aT
  })
}

export function KanbanBoard({ leads, onDragEnd, onAddLead }: KanbanBoardProps) {
  const [draggedLead, setDraggedLead]       = useState<Lead | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<CanonicalLeadStatus | null>(null)
  const [expanded, setExpanded]             = useState<Set<CanonicalLeadStatus>>(new Set())

  const toggleExpanded = (id: CanonicalLeadStatus) =>
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

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
    <div className="flex gap-3 px-5 pb-8 min-w-max items-start">
      {KANBAN_COLUMNS.map((column) => {
        const allLeads     = prioritizeLeads(leads.filter(l => normalizeStatus(l.status) === column.id))
        const columnValue  = allLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0)
        const isExpanded   = expanded.has(column.id)
        const visibleLeads = isExpanded ? allLeads : allLeads.slice(0, CARD_LIMIT)
        const hiddenCount  = allLeads.length - CARD_LIMIT
        const isDragTarget = dragOverColumn === column.id

        return (
          <div
            key={column.id}
            className={cn(
              "w-[240px] flex-shrink-0 flex flex-col rounded-xl border border-border/60 bg-card shadow-sm border-t-2 transition-shadow",
              column.accentBorder,
              isDragTarget && "ring-2 ring-primary/30 shadow-md"
            )}
            onDragOver={e => handleDragOver(e, column.id)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={e => handleDrop(e, column.id)}
          >
            {/* Column header */}
            <div className="px-3.5 py-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full flex-shrink-0", column.dotColor)} />
                  <span className="text-[13px] font-semibold text-foreground">{column.label}</span>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground tabular-nums bg-secondary/60 px-1.5 py-0.5 rounded-full">
                  {allLeads.length}
                </span>
              </div>
              {columnValue > 0 && (
                <p className="mt-0.5 text-[12px] font-medium text-muted-foreground tabular-nums pl-4">
                  {formatCurrency(columnValue)}
                </p>
              )}
            </div>

            {/* Card area — min-h keeps all columns equal when collapsed */}
            <div className={cn(
              "p-2.5 space-y-2 min-h-[280px]",
              isExpanded && "max-h-[480px] overflow-y-auto"
            )}>
              {allLeads.length === 0 ? (
                <EmptyLane isDragTarget={isDragTarget} onAddLead={onAddLead} />
              ) : (
                visibleLeads.map(lead => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    isDragging={draggedLead?.id === lead.id}
                    onDragStart={e => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>

            {/* Expand / collapse footer */}
            {hiddenCount > 0 && (
              <div className="border-t border-border/40 px-3 py-2">
                <button
                  onClick={() => toggleExpanded(column.id)}
                  className={cn(
                    "w-full flex items-center justify-center gap-1.5 rounded-md py-1 text-[11px] font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {isExpanded ? (
                    <><ChevronUp className="h-3 w-3" /> Show less</>
                  ) : (
                    <><ChevronDown className="h-3 w-3" /> +{hiddenCount} more</>
                  )}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function EmptyLane({ isDragTarget, onAddLead }: { isDragTarget: boolean; onAddLead: () => void }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-2.5 h-[200px] rounded-lg border-2 border-dashed transition-colors",
      isDragTarget ? "border-primary/40 bg-primary/5" : "border-border/40"
    )}>
      <p className="text-[11px] text-muted-foreground/50 font-medium">No leads here</p>
      <button
        onClick={onAddLead}
        className={cn(
          "flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-all",
          "border border-border/60 rounded-md px-2.5 py-1.5",
          "hover:text-foreground hover:border-border hover:bg-secondary/40 hover:shadow-sm"
        )}
      >
        <Plus className="h-3 w-3" />
        Add Lead
      </button>
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
        "group rounded-lg border border-border/70 bg-background p-3 cursor-grab active:cursor-grabbing",
        "shadow-sm transition-all duration-150",
        "hover:shadow-md hover:border-border hover:-translate-y-0.5 hover:bg-card",
        isDragging && "opacity-40 scale-[1.01] shadow-lg ring-2 ring-primary/20 rotate-1"
      )}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/20 mt-0.5 flex-shrink-0 group-hover:text-muted-foreground/40 transition-colors" />
        <div className="flex-1 min-w-0">
          <Link
            href={`/leads?id=${lead.id}`}
            className="text-[13px] font-semibold text-foreground hover:underline block truncate leading-tight"
            onClick={e => e.stopPropagation()}
          >
            {lead.name || "Unknown"}
          </Link>
          {lead.service && (
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
              {lead.service}
            </p>
          )}

          <div className="flex items-center justify-between mt-2.5 gap-2">
            <span className={cn(
              "text-[13px] font-bold tabular-nums",
              lead.estimated_value ? "text-foreground" : "text-muted-foreground/40"
            )}>
              {lead.estimated_value ? formatCurrency(lead.estimated_value) : "—"}
            </span>
            {lead.source && (
              <span className="text-[10px] font-medium text-muted-foreground/60 bg-secondary/60 px-1.5 py-0.5 rounded-full truncate max-w-[72px] flex-shrink-0">
                {lead.source}
              </span>
            )}
          </div>

          {lead.last_contact_at && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/30 text-[10px] text-muted-foreground/60">
              <Clock className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">{formatRelativeTime(lead.last_contact_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
