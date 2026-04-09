'use client'

import Link from 'next/link'
import { ArrowRight, Check, Zap, Users, FileText, Star, TrendingUp, Bot, Globe } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'

// ── Shared design tokens ──────────────────────────────────────────────────────

const BLUE_BTN = "inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-[14px] font-semibold text-white shadow-[0_2px_14px_rgba(59,130,246,0.40)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_24px_rgba(59,130,246,0.55)] hover:-translate-y-px active:translate-y-0 transition-all duration-150"
const GHOST_BTN = "inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-[14px] font-semibold text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-150"

// ── Product visual mock ───────────────────────────────────────────────────────

function ProductMock() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0">
      {/* Glow behind mock */}
      <div className="absolute inset-0 -m-8 bg-blue-600/15 blur-[60px] rounded-full" />

      {/* Main dashboard card */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-gradient-to-br from-blue-500 to-indigo-700">
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[11px] font-semibold text-white/40 tracking-tight">Automax · Dashboard</span>
          </div>
        </div>

        <div className="p-5">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Revenue MTD', value: '$14,240', up: true },
              { label: 'Open Quotes', value: '8', up: null },
              { label: 'Jobs Booked', value: '23', up: true },
            ].map(k => (
              <div key={k.label} className="rounded-xl border border-white/8 bg-[#0a1525] px-3 py-2.5">
                <div className="text-[10px] text-white/35 mb-1">{k.label}</div>
                <div className="text-[16px] font-bold text-white tabular-nums">{k.value}</div>
                {k.up && (
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">↑ 18%</div>
                )}
              </div>
            ))}
          </div>

          {/* Pipeline columns */}
          <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-3">Pipeline</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'New Leads', count: 4, color: 'border-blue-500/30 bg-blue-500/5', dot: 'bg-blue-400' },
              { label: 'Quoted',    count: 6, color: 'border-violet-500/30 bg-violet-500/5', dot: 'bg-violet-400' },
              { label: 'Scheduled', count: 3, color: 'border-emerald-500/30 bg-emerald-500/5', dot: 'bg-emerald-400' },
            ].map(col => (
              <div key={col.label} className={`rounded-xl border p-3 ${col.color}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
                  <span className="text-[10px] font-semibold text-white/50">{col.label}</span>
                </div>
                {Array.from({ length: col.count }).map((_, i) => (
                  <div key={i} className="h-1.5 rounded-full bg-white/10 mb-1.5 last:mb-0" style={{ width: `${65 + (i * 11) % 30}%` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating card — New Lead */}
      <div className="absolute -top-4 -right-4 sm:-right-6 w-[190px] rounded-xl border border-white/12 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 ring-1 ring-blue-500/30">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          </div>
          <span className="text-[11px] font-semibold text-white">New Lead</span>
          <span className="ml-auto text-[10px] text-white/30">just now</span>
        </div>
        <div className="text-[12px] font-semibold text-white">Marcus T.</div>
        <div className="text-[11px] text-white/40 mt-0.5">House wash · $380 est.</div>
        <div className="mt-2 flex gap-1.5">
          <div className="flex-1 rounded-md bg-blue-600/25 py-1 text-center text-[10px] font-semibold text-blue-300">Reply</div>
          <div className="flex-1 rounded-md bg-white/6 py-1 text-center text-[10px] font-medium text-white/50">Ignore</div>
        </div>
      </div>

      {/* Floating card — Quote sent */}
      <div className="absolute -bottom-4 -left-4 sm:-left-6 w-[196px] rounded-xl border border-white/12 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20">
            <Check className="h-3 w-3 text-emerald-400" />
          </div>
          <span className="text-[11px] font-semibold text-white">Quote Approved</span>
        </div>
        <div className="text-[11px] text-white/40">Q-2025-042 · Sarah M.</div>
        <div className="text-[15px] font-bold text-white mt-1">$1,240</div>
        <div className="mt-1 text-[10px] text-emerald-400 font-medium">→ Deposit collected</div>
      </div>
    </div>
  )
}

// ── Feature icon wrapper ──────────────────────────────────────────────────────

function FeatureIcon({ icon: Icon, color }: { icon: React.ElementType; color: string }) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
  )
}

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5">
      <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
      <span className="text-[12px] font-semibold text-blue-300 tracking-wide">{children}</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <MarketingShell>
    <div className="bg-background">
      <MarketingNav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#080f1e] overflow-hidden pt-16">
        {/* Background effects */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/20 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/15 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — copy */}
            <div>
              <div className="mb-6">
                <SectionLabel>AI-Powered · Built for Service Businesses</SectionLabel>
              </div>

              <h1 className="text-[40px] sm:text-[52px] lg:text-[58px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Your AI runs<br className="hidden sm:block" /> the systems.<br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  You run the business.
                </span>
              </h1>

              <p className="text-[17px] text-white/55 leading-relaxed max-w-[480px] mb-8">
                Automax is an AI-powered operating system for service businesses — capturing leads, sending quotes, following up automatically, and growing your reputation while you focus on the job.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/auth/sign-up" className={BLUE_BTN}>
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className={GHOST_BTN}>
                  See Pricing
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {['No credit card required', 'Setup in minutes', 'Cancel anytime'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                    <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product mock */}
            <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
              <ProductMock />
            </div>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="h-16 bg-gradient-to-b from-transparent to-white dark:to-background" />
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-background border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-8">
            Trusted by service businesses across the country
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '500+', label: 'Contractors active' },
              { value: '$8M+', label: 'Quotes sent monthly' },
              { value: '4.9★', label: 'Average rating' },
              { value: '40%', label: 'Avg. revenue lift' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-[28px] font-bold text-foreground tracking-tight">{s.value}</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE PILLARS ──────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel>Platform Overview</SectionLabel>
            <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-foreground leading-tight">
              Everything your business needs.<br className="hidden sm:block" />
              <span className="text-blue-600">Nothing you don&apos;t.</span>
            </h2>
            <p className="mt-4 text-[16px] text-muted-foreground max-w-xl mx-auto">
              Automax replaces the patchwork of apps most contractors cobble together — one system, fully connected.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users, color: 'bg-blue-500/10 text-blue-600',
                title: 'Lead Inbox & CRM',
                desc: 'Every lead, call, and message lands in one inbox. AI responds instantly, qualifies the request, and adds them to your pipeline.',
              },
              {
                icon: FileText, color: 'bg-violet-500/10 text-violet-600',
                title: 'Quotes & Payments',
                desc: 'Send polished, professional quotes in under 60 seconds. Collect deposits, send reminders, and close faster.',
              },
              {
                icon: Zap, color: 'bg-amber-500/10 text-amber-600',
                title: 'Smart Automations',
                desc: 'Follow-up sequences, appointment reminders, and review requests — triggered automatically so nothing slips.',
              },
              {
                icon: Star, color: 'bg-emerald-500/10 text-emerald-600',
                title: 'Google Reviews Engine',
                desc: 'After every job, Automax automatically requests a review via text. Grow your star rating without lifting a finger.',
              },
              {
                icon: TrendingUp, color: 'bg-teal-500/10 text-teal-600',
                title: 'Business Dashboard',
                desc: 'Revenue, job volume, pipeline value, and conversion rates — all visible at a glance, updated in real-time.',
              },
              {
                icon: Bot, color: 'bg-pink-500/10 text-pink-600',
                title: 'AI Assistant',
                desc: 'Draft replies, summarize lead history, generate quote line items, and get revenue projections — all powered by AI.',
              },
            ].map(f => (
              <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 hover:border-blue-500/30 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_4px_24px_rgba(59,130,246,0.08)] transition-all duration-200">
                <FeatureIcon icon={f.icon} color={f.color} />
                <h3 className="mt-4 text-[15px] font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY AUTOMAX ──────────────────────────────────────────────────── */}
      <section className="bg-muted/40 dark:bg-secondary/20 py-20 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Why Automax</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-foreground leading-tight">
                Stop losing jobs<br />to slower competitors.
              </h2>
              <p className="mt-4 text-[16px] text-muted-foreground leading-relaxed max-w-md">
                Most service businesses lose a lead within minutes of it being sent — because no one responded fast enough. Automax AI responds to every lead instantly, qualifies their request, and keeps them warm until you&apos;re ready to close.
              </p>
              <ul className="mt-7 space-y-3.5">
                {[
                  'AI responds to new leads in under 60 seconds — even at 11pm',
                  'Automated quote follow-ups that re-engage cold prospects',
                  'Review requests sent after every completed job',
                  'Full client history visible in one place',
                  'Revenue forecasting so you always know where you stand',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 ring-1 ring-blue-500/20">
                      <Check className="h-3 w-3 text-blue-600" />
                    </span>
                    <span className="text-[14px] text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/auth/sign-up" className={BLUE_BTN}>
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Stats panel */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { metric: '2×', desc: 'More leads closed on average vs. manual follow-up', accent: false },
                { metric: '< 60s', desc: 'Average AI response time to new inbound leads', accent: true },
                { metric: '40%', desc: 'Average revenue growth in the first 6 months', accent: false },
                { metric: '5★', desc: 'Average Google rating after 90 days of review automation', accent: false },
              ].map(s => (
                <div key={s.metric} className={`rounded-2xl border p-6 ${s.accent ? 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/8' : 'border-border bg-card'}`}>
                  <div className={`text-[36px] font-bold tracking-tight leading-none ${s.accent ? 'text-blue-600' : 'text-foreground'}`}>{s.metric}</div>
                  <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI AUTOMATION SECTION ─────────────────────────────────────────── */}
      <section className="relative bg-[#080f1e] overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/20" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel>AI + Automation</SectionLabel>
            <h2 className="mt-4 text-[32px] sm:text-[42px] font-bold text-white tracking-tight leading-tight">
              The AI does the admin.<br />
              <span className="text-blue-400">You do the work.</span>
            </h2>
            <p className="mt-4 text-[16px] text-white/50 max-w-lg mx-auto leading-relaxed">
              Automax isn&apos;t just software — it&apos;s an AI teammate that handles the busywork of running a service business at scale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: '01', title: 'Instant Lead Response',
                desc: 'New lead comes in via web form, Google, or text. AI responds within 60 seconds with a personalized message, asks qualifying questions, and moves them to your pipeline.',
              },
              {
                num: '02', title: 'AI Quote Drafting',
                desc: 'Describe the job or let a lead describe it. Automax AI drafts a professional line-item quote based on your pricing history. You review and send in one click.',
              },
              {
                num: '03', title: 'Automated Follow-Up',
                desc: 'Quotes that go unread get automatic follow-ups. Cold leads get re-engagement sequences. Every action is logged and paused the moment they respond.',
              },
              {
                num: '04', title: 'Review Requests',
                desc: 'Job marked complete? Automax sends a review request via SMS 24 hours later. No setup, no manual work. Your star count grows automatically.',
              },
              {
                num: '05', title: 'Revenue Projections',
                desc: 'AI analyzes your pipeline, seasonal patterns, and job velocity to project next month\'s revenue — so you can plan hiring, equipment, and marketing spend.',
              },
              {
                num: '06', title: 'Smart Scheduling',
                desc: 'Route optimization, appointment confirmations, and reminder texts — all automated so your crew shows up and clients are ready.',
              },
            ].map(f => (
              <div key={f.num} className="group rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200">
                <div className="text-[11px] font-bold text-blue-500/60 mb-3 tracking-wider">{f.num}</div>
                <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
                <p className="text-[13px] text-white/45 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE WEBSITE OFFER ───────────────────────────────────────────── */}
      <section className="bg-white dark:bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-px shadow-[0_24px_80px_rgba(59,130,246,0.25)]">
            <div className="rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-[#0d1f48] to-[#0a1630] px-8 py-12 sm:px-12 lg:px-16 lg:py-16">
              <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <span className="text-[12px] font-bold uppercase tracking-wider text-blue-400">Complimentary Website</span>
                  </div>
                  <h2 className="text-[28px] sm:text-[36px] font-bold text-white leading-tight tracking-tight mb-4">
                    We&apos;ll build your business website.<br />Professionally designed. Free.
                  </h2>
                  <p className="text-[15px] text-white/55 leading-relaxed max-w-xl mb-6">
                    Every Growth and Max plan subscriber receives a complimentary professional website — built by our team, optimized for local search, and integrated with your Automax lead system. You review it before it goes live. No catch, no hidden fees.
                  </p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {[
                      'Mobile-optimized design',
                      'Local SEO ready',
                      'Lead capture forms built-in',
                      'Connected to your Automax inbox',
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2 text-[13px] text-white/60">
                        <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 lg:min-w-[200px]">
                  <Link
                    href="/pricing"
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[14px] font-bold text-blue-700 shadow-lg hover:bg-blue-50 transition-colors"
                  >
                    See Qualifying Plans <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-[14px] font-medium text-white/70 hover:text-white hover:border-white/35 transition-colors"
                  >
                    View Example Sites
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-muted/40 dark:bg-secondary/20 py-20 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-foreground">
              Built for people who do real work.
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">What service pros say after using Automax.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                quote: "I was skeptical about the AI stuff but within two weeks of using Automax my lead response rate went from maybe 40% to basically 100%. The AI handles the initial message and I just step in when it's time to close.",
                name: 'Tyler R.',
                role: 'Pressure Washing — Austin, TX',
                stars: 5,
              },
              {
                quote: "The quote tool alone is worth it. I used to spend 20 minutes making quotes in Excel. Now it takes me 2 minutes and they actually look professional. Customers comment on it.",
                name: 'Jordan M.',
                role: 'Mobile Detailing — Charlotte, NC',
                stars: 5,
              },
              {
                quote: "The review automation is unreal. I went from 34 Google reviews to 127 in about 3 months. I didn't do anything — Automax just texted my customers after jobs and they left reviews.",
                name: 'Angela S.',
                role: 'Residential Cleaning — Denver, CO',
                stars: 5,
              },
            ].map(t => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[14px] text-foreground leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="text-[13px] font-semibold text-foreground">{t.name}</div>
                  <div className="text-[12px] text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#080f1e] overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-blue-600/15 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl px-5 sm:px-6 text-center">
          <h2 className="text-[36px] sm:text-[48px] font-bold text-white tracking-tight leading-tight mb-5">
            Ready to run a real<br />
            <span className="text-blue-400">operating system</span>?
          </h2>
          <p className="text-[17px] text-white/50 mb-8 max-w-lg mx-auto leading-relaxed">
            Join 500+ service businesses using Automax to win more jobs, automate the admin, and grow faster.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/auth/sign-up" className={BLUE_BTN} style={{ fontSize: '15px', padding: '14px 28px' }}>
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#" className={GHOST_BTN} style={{ fontSize: '15px', padding: '14px 28px' }}>
              Book a Demo
            </Link>
          </div>
          <p className="mt-5 text-[12px] text-white/25">No credit card required · Free 14-day trial · Cancel anytime</p>
        </div>
      </section>

      <MarketingFooter />
    </div>
    </MarketingShell>
  )
}
