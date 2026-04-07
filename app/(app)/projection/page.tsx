"use client"

import {
  TrendingUp,
  BarChart3,
  SlidersHorizontal,
  Lightbulb,
  Sparkles,
  Lock,
  ArrowRight,
  Activity,
  MapPin,
  Target,
  Zap,
  Telescope,
} from "lucide-react"
import { cn } from "@/lib/utils"

const modules = [
  {
    icon: BarChart3,
    title: "Revenue Projection",
    description:
      "Estimate your monthly and yearly revenue based on real job and lead data. Know what you're on track to earn before the month ends.",
    detail: "Understand where your business is heading at a glance.",
  },
  {
    icon: SlidersHorizontal,
    title: "Growth Simulator",
    description:
      "Adjust leads, close rate, or average job value to instantly see how it changes your projected revenue. Model different scenarios in seconds.",
    detail: "See how small changes can add thousands to your yearly income.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description:
      "Identify missed opportunities and revenue gaps across your pipeline. Projection surfaces patterns in your data that are hard to see manually.",
    detail: "Understand what's holding your business back and where to improve.",
  },
  {
    icon: Lightbulb,
    title: "Recommendations",
    description:
      "Get actionable, personalized suggestions to increase revenue based on your actual business data — not generic advice.",
    detail: "Turn insights into growth with simple next steps.",
  },
]

const futureCapabilities = [
  { icon: Activity,          label: "Seasonality Modeling" },
  { icon: MapPin,            label: "Location-Based Trends" },
  { icon: Target,            label: "Forecast Accuracy" },
  { icon: Zap,               label: "Smart Growth Recs" },
  { icon: Telescope,         label: "Year-Over-Year View" },
]

export default function ProjectionPage() {
  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* ── Header ── */}
      <header className="border-b border-border bg-card px-5 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-semibold text-foreground tracking-tight">Projection</h1>
                <span className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-widest shadow-sm">
                  Max
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-muted-foreground max-w-xl">
                See how much your business is on track to make — and how to grow it
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground/60 max-w-xl">
                Projection uses your real business data to estimate future revenue and identify opportunities to increase it.
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

        {/* ── Hero callout ── */}
        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-transparent p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/10">
              <Lock className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground">
                Your business, projected forward
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
                Projection turns your pipeline, jobs, and performance history into a clear view of your future revenue —
                so you can make smarter decisions and grow faster. Know what you're on track to earn, and exactly what
                to change to earn more. Early access opens to MAX plan members first.
              </p>
            </div>
          </div>
        </div>

        {/* ── Module cards — 2×2 grid ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((mod, i) => (
            <div
              key={mod.title}
              className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-blue-500/30 hover:bg-blue-600/[0.02]"
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

              {/* Detail */}
              <p className="mt-4 text-[11px] text-muted-foreground/60 border-t border-border pt-3">
                {mod.detail}
              </p>

              {/* Coming soon */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-blue-500/70">
                <div className="h-1 w-1 rounded-full bg-blue-500/60" />
                Coming soon
              </div>
            </div>
          ))}
        </div>

        {/* ── Future capabilities strip ── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-4">
            Also on the roadmap
          </p>
          <div className="flex flex-wrap gap-2.5">
            {futureCapabilities.map(cap => (
              <div
                key={cap.label}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-[12px] font-medium text-muted-foreground"
              >
                <cap.icon className="h-3.5 w-3.5 text-blue-500/70 flex-shrink-0" />
                {cap.label}
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/40 px-3 py-2 text-[12px] font-medium text-muted-foreground/40 italic">
              + more coming
            </div>
          </div>
        </div>

        {/* ── Bottom CTA / early access ── */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-foreground">Get early access to Projection</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Rolling out to MAX plan members first. Join the waitlist to be notified when it's ready.
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
