"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  type Lead,
  getStatusLabel,
  getStatusColor,
  formatRelativeTime,
  formatCurrency,
  normalizeStatus,
  LEAD_STATUSES,
} from "@/lib/data-service"
import { useMessages } from "@/hooks/use-data"
import { Search, Plus, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface LeadListProps {
  leads: Lead[]
  selectedLead: Lead | null
  onSelectLead: (lead: Lead) => void
  onAddLead: () => void
}

// Use canonical lead statuses for filtering
const statusFilters = LEAD_STATUSES

export function LeadList({
  leads,
  selectedLead,
  onSelectLead,
  onAddLead,
}: LeadListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      (lead.name || "").toLowerCase().includes(query) ||
      (lead.service || "").toLowerCase().includes(query) ||
      (lead.source || "").toLowerCase().includes(query) ||
      (lead.address || "").toLowerCase().includes(query)

    const matchesFilter =
      activeFilters.length === 0 || activeFilters.includes(normalizeStatus(lead.status))

    return matchesSearch && matchesFilter
  })

  const toggleFilter = (status: string) => {
    setActiveFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  const clearFilters = () => {
    setActiveFilters([])
    setSearchQuery("")
  }

  // Group leads by priority (using normalized status)
  const newLeads = filteredLeads.filter(l => normalizeStatus(l.status) === "new")
  const otherLeads = filteredLeads.filter(l => normalizeStatus(l.status) !== "new")

  return (
    <div className="w-full lg:w-72 flex-shrink-0 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">Inbox</h2>
          <Button size="sm" onClick={onAddLead} className="h-7 text-[12px]">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Lead
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-[13px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn(
                  "h-8 w-8",
                  activeFilters.length > 0 && "border-foreground"
                )}
              >
                <Filter className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-[12px]">Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statusFilters.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={activeFilters.includes(status)}
                  onCheckedChange={() => toggleFilter(status)}
                  className="text-[13px]"
                >
                  {getStatusLabel(status)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active filters */}
        {(activeFilters.length > 0 || searchQuery) && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-muted-foreground">
              {filteredLeads.length} result{filteredLeads.length !== 1 ? "s" : ""}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-5 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Lead List */}
      <div className="flex-1 overflow-y-auto">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <p className="text-[13px] text-muted-foreground">No leads found</p>
            <Button variant="link" size="sm" onClick={clearFilters} className="text-[13px]">
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* New leads section */}
            {newLeads.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-blue-500/10 border-b border-border">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                    New ({newLeads.length})
                  </span>
                </div>
                {newLeads.map((lead) => (
                  <LeadRow 
                    key={lead.id} 
                    lead={lead} 
                    isSelected={selectedLead?.id === lead.id}
                    onSelect={() => onSelectLead(lead)}
                  />
                ))}
              </div>
            )}
            
            {/* Other leads */}
            {otherLeads.length > 0 && (
              <div>
                {newLeads.length > 0 && (
                  <div className="px-4 py-2 bg-secondary/30 border-b border-border">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      All Leads ({otherLeads.length})
                    </span>
                  </div>
                )}
                {otherLeads.map((lead) => (
                  <LeadRow 
                    key={lead.id} 
                    lead={lead} 
                    isSelected={selectedLead?.id === lead.id}
                    onSelect={() => onSelectLead(lead)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function LeadRow({ 
  lead, 
  isSelected, 
  onSelect 
}: { 
  lead: Lead
  isSelected: boolean
  onSelect: () => void 
}) {
  const { messages } = useMessages(lead.id)
  const hasUnread = messages.some((m) => !m.is_read && m.sender_type === "lead")
  const lastMessage = messages[messages.length - 1]
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full px-4 py-3 text-left transition-colors border-b border-border",
        "hover:bg-secondary/50",
        isSelected && "bg-secondary"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-foreground truncate">
              {lead.name || "Unknown"}
            </span>
            {hasUnread && (
              <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
            )}
          </div>
          <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
            {lead.service || "Service not specified"}
          </p>
        </div>
        <span className="text-[11px] text-muted-foreground flex-shrink-0 tabular-nums">
          {lead.last_contact_at ? formatRelativeTime(lead.last_contact_at) : "-"}
        </span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span
          className={cn(
            "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border",
            getStatusColor(lead.status)
          )}
        >
          {getStatusLabel(lead.status)}
        </span>
        <span className="text-[12px] font-medium text-foreground tabular-nums">
          {lead.estimated_value ? formatCurrency(lead.estimated_value) : "-"}
        </span>
      </div>
      {lastMessage && (
        <p className="text-[12px] text-muted-foreground mt-2 line-clamp-1">
          {lastMessage.content}
        </p>
      )}
    </button>
  )
}
