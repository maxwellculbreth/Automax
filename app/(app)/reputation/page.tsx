"use client"

import { useState } from "react"
import {
  ShieldCheck,
  Star,
  Clock,
  Globe,
  User,
  CheckCircle2,
  Circle,
  TrendingUp,
  Zap,
  MessageSquare,
  Send,
  Link2,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCompany } from "@/hooks/use-data"

// ── Helpers ────────────────────────────────────────────────────────────────

function ScoreBar({ score, max, color }: { score: number; max: number; color: string }) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${(score / max) * 100}%` }}
      />
    </div>
  )
}

function KPICard({
  label, value, sub, icon: Icon, accent = false, accentColor = "blue",
}: {
  label: string; value: string; sub?: string; icon: React.ElementType
  accent?: boolean; accentColor?: "amber" | "emerald" | "blue" | "violet"
}) {
  const colors = {
    amber:   { bg: "bg-amber-500/10 dark:bg-amber-500/15",   icon: "text-amber-500 dark:text-amber-400"   },
    emerald: { bg: "bg-emerald-500/10 dark:bg-emerald-500/15", icon: "text-emerald-500 dark:text-emerald-400" },
    blue:    { bg: "bg-blue-600/10 dark:bg-blue-500/15",     icon: "text-blue-600 dark:text-blue-400"      },
    violet:  { bg: "bg-violet-500/10 dark:bg-violet-500/15", icon: "text-violet-500 dark:text-violet-400"  },
  }
  const c = colors[accentColor]
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon className={`h-3.5 w-3.5 ${c.icon}`} />
        </div>
      </div>
      <div className="text-[24px] font-bold text-foreground leading-none">{value}</div>
      {sub && <div className="mt-1.5 text-[12px] text-muted-foreground">{sub}</div>}
    </div>
  )
}

// ── Reputation score breakdown ─────────────────────────────────────────────

const SCORE_COMPONENTS = [
  { label: "Review Rating",      pts: 28, max: 30, detail: "4.9★ average",     color: "bg-amber-400"   },
  { label: "Review Volume",      pts: 17, max: 20, detail: "127 total reviews", color: "bg-amber-300"   },
  { label: "Response Time",      pts: 18, max: 20, detail: "< 2 min average",  color: "bg-emerald-400" },
  { label: "Profile Completeness", pts: 12, max: 15, detail: "6 of 8 fields",  color: "bg-blue-400"    },
  { label: "Website Readiness",  pts:  9, max: 15, detail: "3 of 5 checks",   color: "bg-violet-400"  },
]

const TOTAL_SCORE = SCORE_COMPONENTS.reduce((sum, c) => sum + c.pts, 0) // 84

// ── Profile completeness ───────────────────────────────────────────────────

const PROFILE_CHECKS = [
  { label: "Business name",        done: true  },
  { label: "Address / location",   done: true  },
  { label: "Phone number",         done: true  },
  { label: "Business description", done: true  },
  { label: "Services list",        done: true  },
  { label: "Logo / profile photo", done: false },
  { label: "Website URL",          done: false },
  { label: "Google Business link", done: true  },
]

// ── Website readiness ──────────────────────────────────────────────────────

const WEBSITE_CHECKS = [
  { label: "Website connected",    done: true  },
  { label: "Mobile-ready",         done: true  },
  { label: "Lead form active",     done: true  },
  { label: "Service area pages",   done: false },
  { label: "Reviews widget",       done: false },
]

// ── Mock activity feed ─────────────────────────────────────────────────────

const ACTIVITY = [
  { icon: Star,           text: "5★ review received — Angela S.",       time: "2 hours ago",   dot: "bg-amber-400"   },
  { icon: Send,           text: "Review request sent — Marcus T.",       time: "5 hours ago",   dot: "bg-blue-400"    },
  { icon: Zap,            text: "Lead response: 48 seconds",             time: "Yesterday",     dot: "bg-emerald-400" },
  { icon: Star,           text: "5★ review received — Jordan M.",        time: "2 days ago",    dot: "bg-amber-400"   },
  { icon: Send,           text: "Review request sent — Sarah M.",        time: "3 days ago",    dot: "bg-blue-400"    },
  { icon: MessageSquare,  text: "New inquiry responded in < 60s",        time: "3 days ago",    dot: "bg-emerald-400" },
  { icon: Link2,          text: "Website lead form received submission", time: "4 days ago",    dot: "bg-violet-400"  },
  { icon: Star,           text: "5★ review received — Tyler R.",         time: "5 days ago",    dot: "bg-amber-400"   },
]

// ── Page ──────────────────────────────────────────────────────────────────

export default function ReputationPage() {
  const { company } = useCompany()
  const [tab, setTab] = useState<"overview" | "reviews" | "activity">("overview")

  const profileDone = PROFILE_CHECKS.filter(c => c.done).length
  const profileTotal = PROFILE_CHECKS.length
  const profilePct = Math.round((profileDone / profileTotal) * 100)

  const websiteDone = WEBSITE_CHECKS.filter(c => c.done).length
  const websiteTotal = WEBSITE_CHECKS.length

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-semibold text-foreground">Reputation</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Track and improve your local trust signals
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 px-3 py-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[12.5px] font-semibold text-amber-600 dark:text-amber-400">4.9 Google</span>
          </div>
        </div>
      </header>

      <div className="px-5 py-5 sm:p-6 lg:p-8">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <KPICard label="Avg. Rating"      value="4.9★"    sub="127 Google reviews"      icon={Star}         accentColor="amber"   />
          <KPICard label="Reviews This Month" value="+18"   sub="↑ from 11 last month"    icon={TrendingUp}   accentColor="amber"   />
          <KPICard label="Avg. Response Time" value="< 2 min" sub="AI handles first reply" icon={Clock}        accentColor="emerald" />
          <KPICard label="Reputation Score"  value={`${TOTAL_SCORE}/100`} sub="Good · Pro feature" icon={ShieldCheck} accentColor="blue"    />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-6">
          {[
            { key: "overview" as const, label: "Overview" },
            { key: "reviews"  as const, label: "Reviews" },
            { key: "activity" as const, label: "Activity" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px",
                tab === t.key
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Left col (2/3) */}
            <div className="lg:col-span-2 space-y-5">

              {/* Reputation Score card */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[13px] font-semibold text-foreground mb-0.5">Automax Reputation Score</div>
                    <div className="text-[12px] text-muted-foreground">
                      Internal score based on review rating, volume, response time, profile, and website readiness
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-[40px] font-bold text-foreground leading-none">{TOTAL_SCORE}</div>
                    <div className="text-[12px] text-muted-foreground">/ 100 · Good</div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="space-y-3">
                  {SCORE_COMPONENTS.map(c => (
                    <div key={c.label} className="flex items-center gap-3">
                      <div className="text-[12.5px] text-muted-foreground w-40 flex-shrink-0">{c.label}</div>
                      <ScoreBar score={c.pts} max={c.max} color={c.color} />
                      <div className="text-right flex-shrink-0 w-16">
                        <span className="text-[12px] font-semibold text-foreground">{c.pts}</span>
                        <span className="text-[11px] text-muted-foreground">/{c.max}</span>
                      </div>
                      <div className="text-[11.5px] text-muted-foreground w-32 flex-shrink-0 hidden sm:block">{c.detail}</div>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[11.5px] text-muted-foreground">
                    This score is an internal Automax metric — not a Google ranking or external SEO score. It helps you track what&apos;s strong and what to improve.
                  </p>
                </div>
              </div>

              {/* Review Request Funnel */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[13px] font-semibold text-foreground">Review Request Performance</div>
                  <span className="text-[11px] text-muted-foreground">Last 30 days</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Requests Sent",    value: "24",  sub: "Automated", color: "text-foreground" },
                    { label: "Opened",           value: "18",  sub: "75% open rate",   color: "text-blue-600 dark:text-blue-400" },
                    { label: "Reviews Left",     value: "11",  sub: "61% conversion",  color: "text-amber-500 dark:text-amber-400" },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg bg-muted/40 px-3 py-3 text-center">
                      <div className={`text-[22px] font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-[11px] font-medium text-foreground mt-0.5">{s.label}</div>
                      <div className="text-[10.5px] text-muted-foreground">{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-blue-600/8 dark:bg-blue-500/10 border border-blue-500/15 px-3 py-2.5">
                  <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <p className="text-[12.5px] text-foreground">
                    Review requests are sent <strong>automatically</strong> 24h after every completed job — no manual action needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Right col (1/3) */}
            <div className="space-y-5">

              {/* Profile Completeness */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold text-foreground">Profile Completeness</div>
                  <span className={cn(
                    "text-[12px] font-bold",
                    profilePct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                  )}>
                    {profilePct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-muted/50 mb-4 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      profilePct >= 80 ? "bg-emerald-500" : "bg-amber-400"
                    )}
                    style={{ width: `${profilePct}%` }}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  {PROFILE_CHECKS.map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      {c.done
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        : <Circle className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                      }
                      <span className={cn("text-[12.5px]", c.done ? "text-foreground" : "text-muted-foreground")}>{c.label}</span>
                    </div>
                  ))}
                </div>

                {PROFILE_CHECKS.some(c => !c.done) && (
                  <a
                    href="/settings"
                    className="flex items-center gap-1.5 text-[12.5px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Complete in Settings <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              {/* Website Readiness */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold text-foreground">Website Readiness</div>
                  <span className="text-[12px] font-semibold text-muted-foreground">{websiteDone}/{websiteTotal}</span>
                </div>

                <div className="space-y-2 mb-4">
                  {WEBSITE_CHECKS.map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      {c.done
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        : <AlertCircle className="h-3.5 w-3.5 text-amber-500/60 flex-shrink-0" />
                      }
                      <span className={cn("text-[12.5px]", c.done ? "text-foreground" : "text-muted-foreground")}>{c.label}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="/settings"
                  className="flex items-center gap-1.5 text-[12.5px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Manage website settings <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Response Time card */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="text-[13px] font-semibold text-foreground mb-3">Avg. Response Time</div>
                <div className="text-[32px] font-bold text-foreground leading-none mb-1">&lt; 2 min</div>
                <div className="text-[12px] text-muted-foreground mb-3">First response to new leads</div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/8 dark:bg-emerald-500/10 border border-emerald-500/15 px-3 py-2">
                  <Zap className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-[12px] text-foreground">AI handling first response</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[12px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Improved from ~4h avg before Automax
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── REVIEWS TAB ──────────────────────────────────────────────── */}
        {tab === "reviews" && (
          <div className="space-y-4">
            {/* Summary row */}
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Avg. Rating</div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-[28px] font-bold text-foreground">4.9</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Total Reviews</div>
                <div className="text-[28px] font-bold text-foreground mt-4">127</div>
                <div className="text-[12px] text-muted-foreground">All time</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">This Month</div>
                <div className="text-[28px] font-bold text-emerald-600 dark:text-emerald-400 mt-4">+18</div>
                <div className="text-[12px] text-muted-foreground">↑ from 11 last month</div>
              </div>
            </div>

            {/* Rating breakdown */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-[13px] font-semibold text-foreground mb-4">Rating Breakdown</div>
              {[
                { stars: 5, count: 118, pct: 93 },
                { stars: 4, count: 7,   pct: 5  },
                { stars: 3, count: 2,   pct: 2  },
                { stars: 2, count: 0,   pct: 0  },
                { stars: 1, count: 0,   pct: 0  },
              ].map(r => (
                <div key={r.stars} className="flex items-center gap-3 mb-2.5 last:mb-0">
                  <div className="flex items-center gap-0.5 w-24 flex-shrink-0">
                    {Array.from({length: r.stars}).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-[12px] text-muted-foreground w-6 text-right">{r.count}</span>
                </div>
              ))}
            </div>

            {/* Recent reviews */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-[13px] font-semibold text-foreground mb-4">Recent Reviews</div>
              <div className="space-y-4">
                {[
                  { name: "Angela S.",  stars: 5, date: "2 days ago",  text: "Incredible service — fast, professional, and thorough. They responded within minutes and the job was perfect. Highly recommend." },
                  { name: "Marcus T.",  stars: 5, date: "5 days ago",  text: "Best pressure washing company in Austin. Showed up on time and my driveway looks brand new. Will use again." },
                  { name: "Jordan M.",  stars: 5, date: "1 week ago",  text: "The online quote process was super easy and they got it done the same week. Very professional team." },
                  { name: "Sarah K.",   stars: 4, date: "2 weeks ago", text: "Great work overall. A couple small spots missed but they came back to touch them up without being asked. Good company." },
                ].map(r => (
                  <div key={r.name} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-foreground">
                          {r.name[0]}
                        </div>
                        <span className="text-[13px] font-semibold text-foreground">{r.name}</span>
                      </div>
                      <span className="text-[11.5px] text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2 pl-9">
                      {Array.from({length: r.stars}).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed pl-9">&ldquo;{r.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVITY TAB ─────────────────────────────────────────────── */}
        {tab === "activity" && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-[13px] font-semibold text-foreground mb-4">Reputation Activity</div>
            <div className="relative">
              <div className="absolute left-[13px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-4">
                {ACTIVITY.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex items-start gap-3 pl-1">
                      <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${item.dot} bg-opacity-20 ring-1 ring-white/10`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                      </div>
                      <div className="flex-1 flex items-center justify-between pt-0.5">
                        <span className="text-[13px] text-foreground">{item.text}</span>
                        <span className="text-[11.5px] text-muted-foreground flex-shrink-0 ml-4">{item.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
