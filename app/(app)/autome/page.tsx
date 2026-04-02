"use client"

import { Sparkles, MessageSquare, BookOpen, CheckCheck, ArrowRight, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const modules = [
  {
    icon: MessageSquare,
    title: "AI SMS Quoting",
    description:
      "Autome reads incoming lead messages, understands the job scope, and generates a precise quote draft in seconds — ready for your one-tap approval before anything is sent.",
    detail: "Connects to your lead inbox and learns your pricing on every job.",
  },
  {
    icon: BookOpen,
    title: "Operator Training",
    description:
      "Teach Autome your services, pricing tiers, and communication style. The more context you provide, the more accurate and on-brand its responses become over time.",
    detail: "Custom knowledge base built from your real jobs and preferences.",
  },
  {
    icon: CheckCheck,
    title: "Approval Queue",
    description:
      "Every AI-generated quote or follow-up lands here before going anywhere. Review, edit, and send with one tap — or configure auto-send thresholds when you're ready.",
    detail: "Full control over every touchpoint, with audit history.",
  },
]

export default function AutomePage() {
  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">
      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-semibold text-foreground tracking-tight">Autome</h1>
                <span className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-widest shadow-sm">
                  Max
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-muted-foreground max-w-xl">
                AI-powered quoting, lead follow-up, and operator-trained messaging
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:flex-shrink-0">
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] font-medium text-muted-foreground">In Development</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 sm:px-6 lg:px-8 space-y-6 max-w-5xl">

        {/* Flagship callout */}
        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-transparent p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/10">
              <Lock className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground">
                The intelligence layer of Automax
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
                Autome is being trained to run your lead response and quoting workflow autonomously.
                It won't replace your judgment — it'll give you a draft worth approving in seconds.
                Early access opens to MAX plan members first.
              </p>
            </div>
          </div>
        </div>

        {/* Module cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <div
              key={mod.title}
              className={cn(
                "group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-blue-500/30 hover:bg-blue-600/[0.02]"
              )}
            >
              {/* Module number */}
              <span className="absolute top-4 right-4 text-[11px] font-medium text-muted-foreground/40 tabular-nums">
                0{i + 1}
              </span>

              {/* Icon */}
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/10">
                <mod.icon className="h-4 w-4 text-blue-500" />
              </div>

              {/* Content */}
              <h3 className="text-[14px] font-semibold text-foreground mb-2">{mod.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">
                {mod.description}
              </p>

              {/* Detail line */}
              <p className="mt-4 text-[11px] text-muted-foreground/60 border-t border-border pt-3">
                {mod.detail}
              </p>

              {/* Coming soon indicator */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-blue-500/70">
                <div className="h-1 w-1 rounded-full bg-blue-500/60" />
                Coming soon
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA / early access */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-foreground">Get early access</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Autome is rolling out to MAX plan members. Join the waitlist to be first in line.
              </p>
            </div>
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-[13px] font-semibold text-white opacity-60 cursor-not-allowed flex-shrink-0"
            >
              Join Waitlist
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
