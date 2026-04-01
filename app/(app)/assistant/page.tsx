"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAIGenerations } from "@/hooks/use-data"
import type { AIGeneration } from "@/lib/data-service"
import { formatRelativeTime } from "@/lib/data-service"
import {
  Sparkles,
  Copy,
  MessageSquare,
  FileText,
  Star,
  RotateCcw,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

const promptTemplates = [
  {
    icon: MessageSquare,
    label: "Draft a reply",
    prompt: "Draft a professional response to a customer asking about pricing for driveway pressure washing.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: RotateCcw,
    label: "Write follow-up",
    prompt: "Write a friendly follow-up to a lead who requested a quote 3 days ago but hasn't responded.",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: FileText,
    label: "Create quote",
    prompt: "Create a detailed quote for a 2,000 sq ft house wash including all siding, eaves, and walkways.",
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Star,
    label: "Request review",
    prompt: "Write a review request message to send after completing a driveway job successfully.",
    color: "text-amber-500 dark:text-amber-400",
  },
]

const typeLabels: Record<string, string> = {
  reply: "Reply",
  follow_up: "Follow-Up",
  quote: "Quote",
  sop: "SOP",
  review_request: "Review",
}

export default function AssistantPage() {
  const { generations: savedGenerations } = useAIGenerations()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [localGenerations, setLocalGenerations] = useState<AIGeneration[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Combine local generations with saved ones
  const generations = [...localGenerations, ...savedGenerations]

  const handleGenerate = () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setTimeout(() => {
      const newGeneration: AIGeneration = {
        id: `gen-${Date.now()}`,
        business_id: "business-1",
        user_id: "user-1",
        type: "reply",
        prompt: prompt,
        content: `Hi there! Thanks for reaching out about pressure washing. I'd be happy to help with your project.\n\nFor a standard driveway (around 600-800 sq ft), our pricing typically runs $200-$300 depending on the condition and any extras like oil stain treatment.\n\nI have availability this Thursday or Friday - would either work for a quick quote visit? I can give you an exact price once I see the area.\n\nThanks,\nMike - Crystal Clear Pressure Washing`,
        created_at: new Date().toISOString(),
      }
      setLocalGenerations((prev) => [newGeneration, ...prev])
      setPrompt("")
      setIsGenerating(false)
    }, 1500)
  }

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const useTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt)
  }

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Assistant</h1>
            <p className="text-[12px] text-muted-foreground">
              Draft replies, quotes, follow-ups, and more
            </p>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
        {/* Input Section */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4 mb-4 sm:mb-6">
          <Textarea
            placeholder="Describe what you need help with..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] resize-none text-[13px] border-0 p-0 focus-visible:ring-0 shadow-none"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mt-3 pt-3 border-t border-border">
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Be specific about the context for better results
            </p>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              size="sm"
              className="h-9 sm:h-8 text-[13px] w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <div className="h-3.5 w-3.5 mr-1.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Quick Prompts
          </h2>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {promptTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => useTemplate(template.prompt)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-md border border-border bg-card text-left hover:bg-secondary/50 transition-colors"
              >
                <template.icon className={cn("h-4 w-4 flex-shrink-0", template.color)} />
                <span className="text-[12px] sm:text-[13px] font-medium text-foreground truncate">{template.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Generations */}
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Recent Generations
          </h2>
          {generations.length === 0 ? (
            <div className="rounded-lg border border-border bg-card py-12">
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-[13px] font-medium text-foreground">No generations yet</p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Start by asking the AI to help you draft something
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {generations.map((generation) => (
                <div key={generation.id} className="rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-secondary text-foreground">
                        {typeLabels[generation.type] || generation.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(generation.created_at)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[12px]"
                      onClick={() => handleCopy(generation.id, generation.content)}
                    >
                      {copiedId === generation.id ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[12px] text-muted-foreground mb-2 line-clamp-1">
                      &quot;{generation.prompt}&quot;
                    </p>
                    <p className="text-[13px] text-foreground whitespace-pre-wrap leading-relaxed">
                      {generation.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
