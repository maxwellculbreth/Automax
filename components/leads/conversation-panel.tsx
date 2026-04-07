"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  type Lead,
  getStatusLabel,
  getStatusColor,
  formatRelativeTime,
  formatCurrency,
} from "@/lib/data-service"
import { useMessages, useCreateMessage, useUpdateLead } from "@/hooks/use-data"
import {
  Send,
  Phone,
  Mail,
  MoreVertical,
  Sparkles,
  PanelRightClose,
  PanelRightOpen,
  FileText,
  CalendarCheck,
  XCircle,
  MessageSquare,
  Copy,
  CheckCircle2,
  MapPin,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ConversationPanelProps {
  lead: Lead | null
  onToggleDetails: () => void
  showDetails: boolean
}

export function ConversationPanel({
  lead,
  onToggleDetails,
  showDetails,
}: ConversationPanelProps) {
  const [message, setMessage] = useState("")
  const [showAISuggestion, setShowAISuggestion] = useState(true)
  const [copiedSuggestion, setCopiedSuggestion] = useState(false)
  
  const { messages, isLoading: messagesLoading, mutate: mutateMessages } = useMessages(lead?.id ?? null)
  const { createMessage, isSending } = useCreateMessage()
  const { updateLead } = useUpdateLead()

  if (!lead) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-[15px] font-medium text-foreground">Select a lead</h3>
          <p className="text-[13px] text-muted-foreground mt-1">
            Choose a lead from the inbox to view conversation
          </p>
        </div>
      </div>
    )
  }

  // Generate AI suggestion - all field access is null-safe
  const getAISuggestion = (): string => {
    const leadName = lead.name || "there"
    const firstName = leadName.split(" ")[0] || "there"
    const leadService = lead.service || "your project"
    const serviceLower = leadService.toLowerCase()
    
    if (lead.status === "new") {
      return `Hi ${firstName}! Thanks for reaching out about ${serviceLower}. I can definitely help with that. When would be a good time to come by for a quick look and give you an exact quote?`
    }
    if (lead.status === "quoted") {
      return `Hi ${firstName}! Just following up on the quote I sent over. Let me know if you have any questions or if you'd like to get on the schedule. I have some availability this week!`
    }
    if (lead.status === "contacted") {
      return `Hi ${firstName}! Checking in to see if you're still interested in the ${serviceLower} work. Happy to answer any questions. Let me know if you'd like to move forward!`
    }
    return `Hi ${firstName}! Thanks for your message. Happy to help with your ${serviceLower} project. What questions can I answer for you?`
  }

  const copySuggestion = () => {
    setMessage(getAISuggestion())
    setCopiedSuggestion(true)
    setTimeout(() => setCopiedSuggestion(false), 2000)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !lead) return
    
    await createMessage({
      lead_id: lead.id,
      company_id: lead.business_id,
      content: message.trim(),
      sender_type: "business",
      channel: "sms",
    })
    
    setMessage("")
    mutateMessages()
    
    // Update lead status if new
    if (lead.status === "new") {
      await updateLead({ id: lead.id, updates: { status: "contacted" } })
    }
  }

  const handleStatusChange = async (status: Lead["status"]) => {
    await updateLead({ id: lead.id, updates: { status } })
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] sm:text-[12px] font-semibold text-background">
              {(lead.name || "?").split(" ").map((n) => n[0] || "").join("").slice(0, 2) || "?"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[13px] sm:text-[14px] font-semibold text-foreground truncate max-w-[140px] sm:max-w-none">{lead.name || "Unknown"}</h2>
              <span
                className={cn(
                  "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border flex-shrink-0",
                  getStatusColor(lead.status)
                )}
              >
                {getStatusLabel(lead.status)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-muted-foreground">
              <span className="truncate max-w-[100px] sm:max-w-none">{lead.service || "Service not specified"}</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline font-medium text-foreground">
                {lead.estimated_value ? formatCurrency(lead.estimated_value) : "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={`tel:${lead.phone}`}>
              <Phone className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={`mailto:${lead.email}`}>
              <Mail className="h-4 w-4" />
            </a>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-[13px]" onClick={() => handleStatusChange("contacted")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Mark Contacted
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px]" onClick={() => handleStatusChange("quoted")}>
                <FileText className="h-4 w-4 mr-2" />
                Send Quote
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px]" onClick={() => handleStatusChange("booked")}>
                <CalendarCheck className="h-4 w-4 mr-2" />
                Mark Booked
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[13px] text-destructive" onClick={() => handleStatusChange("lost")}>
                <XCircle className="h-4 w-4 mr-2" />
                Mark Lost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDetails}
            className="hidden lg:flex h-8 w-8"
          >
            {showDetails ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Lead Info Bar - hidden on small mobile */}
      <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-secondary/30 border-b border-border text-[12px]">
        <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{lead.address || "No address"}</span>
        </div>
        <span className="text-muted-foreground flex-shrink-0">·</span>
        <span className="text-muted-foreground flex-shrink-0">{lead.source || "Unknown source"}</span>
        {lead.sqft && (
          <>
            <span className="text-muted-foreground flex-shrink-0">·</span>
            <span className="text-muted-foreground flex-shrink-0">{lead.sqft.toLocaleString()} sq ft</span>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-[13px] text-muted-foreground">No messages yet</p>
            <p className="text-[12px] text-muted-foreground mt-1">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.sender_type === "lead" ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5",
                  msg.sender_type === "lead"
                    ? "bg-secondary text-foreground rounded-bl-md"
                    : msg.sender_type === "ai"
                    ? "bg-blue-500/10 text-foreground border border-blue-500/20 rounded-br-md"
                    : "bg-primary text-primary-foreground rounded-br-md"
                )}
              >
                {msg.sender_type === "ai" && (
                  <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 mb-1 font-medium">
                    <Sparkles className="h-3 w-3" />
                    AI Generated
                  </div>
                )}
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1.5",
                    msg.sender_type === "lead"
                      ? "text-muted-foreground"
                      : msg.sender_type === "ai"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-primary-foreground/60"
                  )}
                >
                  {formatRelativeTime(msg.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Suggestion */}
      {showAISuggestion && lead.status !== "booked" && lead.status !== "lost" && (
        <div className="px-3 sm:px-4 pb-2">
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                <Sparkles className="h-3 w-3" />
                AI Suggested Reply
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-500/10"
                onClick={() => setShowAISuggestion(false)}
              >
                Dismiss
              </Button>
            </div>
            <p className="text-[12px] sm:text-[13px] text-foreground leading-relaxed">{getAISuggestion()}</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2.5 w-full sm:w-auto h-8 sm:h-7 text-[12px] sm:text-[11px] border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
              onClick={copySuggestion}
            >
              {copiedSuggestion ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Use This Reply
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[44px] max-h-32 resize-none text-[13px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button 
            className="flex-shrink-0 h-11 w-11" 
            size="icon"
            onClick={handleSendMessage}
            disabled={isSending || !message.trim()}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="outline" size="sm" className="h-8 sm:h-7 text-[12px] sm:text-[11px] flex-1 sm:flex-none" onClick={() => handleStatusChange("quoted")}>
            <FileText className="h-3 w-3 mr-1" />
            Send Quote
          </Button>
          <Button variant="outline" size="sm" className="h-8 sm:h-7 text-[12px] sm:text-[11px] flex-1 sm:flex-none" onClick={() => handleStatusChange("booked")}>
            <CalendarCheck className="h-3 w-3 mr-1" />
            Book Job
          </Button>
        </div>
      </div>
    </div>
  )
}
