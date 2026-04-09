"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  type Lead,
  getStatusLabel,
  getStatusColor,
  formatRelativeTime,
  formatCurrency,
  normalizeStatus,
} from "@/lib/data-service"
import { useMessages } from "@/hooks/use-data"
import { Search, Plus, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { value: "all",       label: "All" },
  { value: "new",       label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted",    label: "Quoted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "lost",      label: "Lost" },
] as const

type SortKey =
  | "latest_activity"
  | "oldest_activity"
  | "newest_created"
  | "oldest_created"
  | "highest_quote"
  | "lowest_quote"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "latest_activity", label: "Latest activity" },
  { value: "oldest_activity", label: "Oldest activity" },
  { value: "newest_created",  label: "Newest created" },
  { value: "oldest_created",  label: "Oldest created" },
  { value: "highest_quote",   label: "Highest quote" },
  { value: "lowest_quote",    label: "Lowest quote" },
]

// ── Props ─────────────────────────────────────────────────────────────────────

interface LeadListProps {
  leads: Lead[]
  selectedLead: Lead | null
  onSelectLead: (lead: Lead) => void
  onAddLead: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LeadList({ leads, selectedLead, onSelectLead, onAddLead }: LeadListProps) {
  const [searchQuery, setSearchQuery]   = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortKey, setSortKey]           = useState<SortKey>("latest_activity")

  const sortFn = useMemo(() => (a: Lead, b: Lead): number => {
    switch (sortKey) {
      case "latest_activity":
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
      case "oldest_activity":
        return new Date(a.updated_at || 0).getTime() - new Date(b.updated_at || 0).getTime()
      case "newest_created":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "oldest_created":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "highest_quote":
        return (b.estimated_value || 0) - (a.estimated_value || 0)
      case "lowest_quote":
        return (a.estimated_value || 0) - (b.estimated_value || 0)
    }
  }, [sortKey])

  const { newSection, mainSection } = useMemo(() => {
    const q = searchQuery.toLowerCase()

    // Filter by search
    let filtered = leads.filter((lead) => {
      if (!q) return true
      return (
        (lead.name    || "").toLowerCase().includes(q) ||
        (lead.service || "").toLowerCase().includes(q) ||
        (lead.source  || "").toLowerCase().includes(q) ||
        (lead.address || "").toLowerCase().includes(q)
      )
    })

    // Filter by status tab
    if (statusFilter !== "all") {
      filtered = filtered.filter(l => normalizeStatus(l.status) === statusFilter)
    }

    // Separate new leads (always pinned first) — only when showing "all"
    if (statusFilter === "all") {
      const newLeads   = filtered.filter(l => normalizeStatus(l.status) === "new")
      const otherLeads = filtered.filter(l => normalizeStatus(l.status) !== "new")
      return {
        newSection:  [...newLeads].sort(sortFn),
        mainSection: [...otherLeads].sort(sortFn),
      }
    }

    return {
      newSection:  [],
      mainSection: [...filtered].sort(sortFn),
    }
  }, [leads, searchQuery, statusFilter, sortFn])

  const totalCount = newSection.length + mainSection.length
  const currentSortLabel = SORT_OPTIONS.find(s => s.value === sortKey)?.label ?? "Sort"

  return (
    <div className="w-full lg:w-72 flex-shrink-0 border-r border-border bg-card flex flex-col h-full">

      {/* Header ───────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-3.5 pb-2.5 border-b border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">Inbox</h2>
          <Button
            size="sm"
            onClick={onAddLead}
            className="h-7 px-2.5 text-[12px] gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-[13px] bg-muted/30 border-muted/60"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-[5px] text-[11px] font-semibold transition-all flex-shrink-0",
                statusFilter === tab.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {totalCount} lead{totalCount !== 1 ? "s" : ""}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              {currentSortLabel}
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setSortKey(opt.value)}
                className="text-[12px] flex items-center justify-between"
              >
                {opt.label}
                {sortKey === opt.value && (
                  <Check className="h-3.5 w-3.5 text-foreground" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Lead list ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <p className="text-[13px] text-muted-foreground">No leads found</p>
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all") }}
                className="mt-2 text-[12px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* New leads — pinned section */}
            {newSection.length > 0 && (
              <>
                <div className="sticky top-0 z-10 px-4 py-1.5 bg-blue-500/10 border-b border-border/60 backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    New · {newSection.length}
                  </span>
                </div>
                {newSection.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    isSelected={selectedLead?.id === lead.id}
                    onSelect={() => onSelectLead(lead)}
                  />
                ))}
              </>
            )}

            {/* Rest of leads */}
            {mainSection.length > 0 && (
              <>
                {newSection.length > 0 && (
                  <div className="sticky top-0 z-10 px-4 py-1.5 bg-card/80 border-b border-border/40 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      All · {mainSection.length}
                    </span>
                  </div>
                )}
                {mainSection.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    isSelected={selectedLead?.id === lead.id}
                    onSelect={() => onSelectLead(lead)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────────

function LeadRow({
  lead,
  isSelected,
  onSelect,
}: {
  lead: Lead
  isSelected: boolean
  onSelect: () => void
}) {
  const { messages } = useMessages(lead.id)
  const hasUnread    = messages.some((m) => !m.is_read && m.sender_type === "lead")
  const lastMsg      = messages[messages.length - 1]
  const isNew        = normalizeStatus(lead.status) === "new"

  const initials = (lead.name || "?")
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase()

  // Use updated_at as the activity timestamp for recency display
  const timestamp = lead.updated_at || lead.created_at

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full px-4 py-3 text-left transition-colors border-b border-border/50",
        "hover:bg-muted/30",
        isSelected && "bg-muted/50 border-l-2 border-l-blue-500",
        !isSelected && isNew && "bg-blue-500/[0.03]"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar bubble */}
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold mt-0.5",
            isNew
              ? "bg-blue-600 text-white"
              : isSelected
              ? "bg-foreground/10 text-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + timestamp row */}
          <div className="flex items-start justify-between gap-1">
            <span
              className={cn(
                "text-[13px] leading-tight truncate",
                isNew || hasUnread
                  ? "font-semibold text-foreground"
                  : "font-medium text-foreground"
              )}
            >
              {lead.name || "Unknown"}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0 mt-px">
              {hasUnread && (
                <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
              )}
              <span className="text-[10.5px] text-muted-foreground tabular-nums">
                {formatRelativeTime(timestamp)}
              </span>
            </div>
          </div>

          {/* Preview: last message or service description */}
          <p className="text-[11.5px] text-muted-foreground truncate mt-0.5 leading-snug">
            {lastMsg
              ? lastMsg.content
              : lead.service || "No messages yet"}
          </p>

          {/* Status + quote row */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border",
                getStatusColor(lead.status)
              )}
            >
              {getStatusLabel(lead.status)}
            </span>
            {lead.estimated_value ? (
              <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                {formatCurrency(lead.estimated_value)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  )
}
