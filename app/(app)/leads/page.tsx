"use client"

import { useState, useEffect } from "react"
import { LeadList } from "@/components/leads/lead-list"
import { ConversationPanel } from "@/components/leads/conversation-panel"
import { LeadDetails } from "@/components/leads/lead-details"
import { AddLeadDialog } from "@/components/leads/add-lead-dialog"
import { useLeads } from "@/hooks/use-data"
import type { Lead } from "@/lib/data-service"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LeadsPage() {
  const { leads, isLoading } = useLeads()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [mobileView, setMobileView] = useState<"list" | "conversation">("list")

  // Select first lead when data loads
  useEffect(() => {
    if (leads.length > 0 && !selectedLead) {
      setSelectedLead(leads[0])
    }
  }, [leads, selectedLead])

  // Update selected lead when leads change
  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find(l => l.id === selectedLead.id)
      if (updated) {
        setSelectedLead(updated)
      }
    }
  }, [leads, selectedLead])

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead)
    setMobileView("conversation")
  }

  const handleBackToList = () => {
    setMobileView("list")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background pt-14 lg:pt-0">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-[13px] text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background pt-14 lg:pt-0">
      {/* Lead List Sidebar - hidden on mobile when viewing conversation */}
      <div className={cn(
        "w-full lg:w-72 flex-shrink-0 lg:block",
        mobileView === "conversation" && "hidden"
      )}>
        <LeadList
          leads={leads}
          selectedLead={selectedLead}
          onSelectLead={handleSelectLead}
          onAddLead={() => setShowAddDialog(true)}
        />
      </div>

      {/* Main Conversation Panel - hidden on mobile when viewing list */}
      <div className={cn(
        "flex-1 min-w-0 lg:flex flex-col",
        mobileView === "list" ? "hidden lg:flex" : "flex"
      )}>
        {/* Mobile back button */}
        {mobileView === "conversation" && (
          <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
        )}
        <div className="flex-1 flex flex-col min-h-0">
          <ConversationPanel
            lead={selectedLead}
            onToggleDetails={() => setShowDetails(!showDetails)}
            showDetails={showDetails}
          />
        </div>
      </div>

      {/* Lead Details Panel - desktop only */}
      {selectedLead && showDetails && (
        <div className="hidden lg:block">
          <LeadDetails lead={selectedLead} onClose={() => setShowDetails(false)} />
        </div>
      )}

      {/* Add Lead Dialog */}
      <AddLeadDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
