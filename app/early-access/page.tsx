import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Zap,
  Users,
  FileText,
  Star,
  TrendingUp,
  Bot,
} from 'lucide-react'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PublicNav } from '@/components/public/public-nav'
import { PublicFooter } from '@/components/public/public-footer'

export const metadata: Metadata = {
  title: 'Automax — Coming Soon',
  description:
    'The AI operating system for service businesses. Capture leads, send quotes, automate follow-up, and grow — all in one place. Join the waitlist for early access.',
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const BLUE_BTN =
  'inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-[14px] font-semibold text-white shadow-[0_2px_14px_rgba(59,130,246,0.40)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_24px_rgba(59,130,246,0.55)] hover:-translate-y-px active:translate-y-0 transition-all duration-150'
const GHOST_BTN =
  'inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-[14px] font-semibold text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-150'

// ── Product mock ──────────────────────────────────────────────────────────────

function ProductMock() {
  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 -m-8 bg-blue-600/15 blur-[60px] rounded-full" />

      {/* Dashboard card */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-gradient-to-br from-blue-500 to-indigo-700">
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[11px] font-semibold text-white/35 tracking-tight">Automax · Dashboard</span>
          </div>
        </div>

        <div className="p-5">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Revenue MTD', value: '$14,240', trend: '↑ 18%' },
              { label: 'Open Quotes', value: '8',       trend: null },
              { label: 'Jobs Booked', value: '23',      trend: '↑ 12%' },
            ].map(k => (
              <div key={k.label} className="rounded-xl border border-white/[0.07] bg-[#0a1525] px-3 py-2.5">
                <div className="text-[10px] text-white/30 mb-1">{k.label}</div>
                <div className="text-[15px] font-bold text-white tabular-nums">{k.value}</div>
                {k.trend && <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">{k.trend}</div>}
              </div>
            ))}
          </div>

          {/* Pipeline */}
          <div className="text-[10px] font-semibold uppercase tracking-widest text-white/20 mb-3">Pipeline</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'New Leads', count: 4, color: 'border-blue-500/25 bg-blue-500/5',     dot: 'bg-blue-400' },
              { label: 'Quoted',    count: 6, color: 'border-violet-500/25 bg-violet-500/5', dot: 'bg-violet-400' },
              { label: 'Scheduled', count: 3, color: 'border-emerald-500/25 bg-emerald-500/5', dot: 'bg-emerald-400' },
            ].map(col => (
              <div key={col.label} className={`rounded-xl border p-3 ${col.color}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
                  <span className="text-[10px] font-semibold text-white/45">{col.label}</span>
                </div>
                {Array.from({ length: col.count }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full bg-white/10 mb-1.5 last:mb-0"
                    style={{ width: `${60 + (i * 13) % 35}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating — New Lead */}
      <div className="absolute -top-4 -right-4 sm:-right-6 w-[188px] rounded-xl border border-white/10 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 ring-1 ring-blue-500/30">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          </div>
          <span className="text-[11px] font-semibold text-white">New Lead</span>
          <span className="ml-auto text-[10px] text-white/25">just now</span>
        </div>
        <div className="text-[12px] font-semibold text-white">Marcus T.</div>
        <div className="text-[11px] text-white/35 mt-0.5">House wash · $380 est.</div>
        <div className="mt-2 flex gap-1.5">
          <div className="flex-1 rounded-md bg-blue-600/25 py-1 text-center text-[10px] font-semibold text-blue-300">Reply</div>
          <div className="flex-1 rounded-md bg-white/[0.05] py-1 text-center text-[10px] font-medium text-white/40">Ignore</div>
        </div>
      </div>

      {/* Floating — Quote Approved */}
      <div className="absolute -bottom-4 -left-4 sm:-left-6 w-[192px] rounded-xl border border-white/10 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20">
            <Check className="h-3 w-3 text-emerald-400" />
          </div>
          <span className="text-[11px] font-semibold text-white">Quote Approved</span>
        </div>
        <div className="text-[11px] text-white/35">Q-2025-042 · Sarah M.</div>
        <div className="text-[15px] font-bold text-white mt-1">$1,240</div>
        <div className="mt-1 text-[10px] text-emerald-400 font-medium">→ Deposit collected</div>
      </div>
    </div>
  )
}

// ── Feature cards ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Users,
    color: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    title: 'Capture every lead',
    desc: 'Every inbound request — form, call, text — lands in one inbox. AI responds instantly and moves them into your pipeline.',
  },
  {
    icon: Bot,
    color: 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20',
    title: 'Automate follow-up',
    desc: 'No lead goes cold. Automated sequences re-engage prospects at the right time without you lifting a finger.',
  },
  {
    icon: FileText,
    color: 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20',
    title: 'Send quotes faster',
    desc: 'Professional, branded quotes in under 60 seconds. Collect deposits and track approvals automatically.',
  },
  {
    icon: Zap,
    color: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    title: 'Manage your pipeline',
    desc: 'See every lead, quote, and job at a glance. Know exactly where each deal stands without digging through texts.',
  },
  {
    icon: Star,
    color: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    title: 'Grow your reputation',
    desc: 'Automatically request Google reviews after every job. Watch your rating climb without asking manually.',
  },
  {
    icon: TrendingUp,
    color: 'bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20',
    title: 'Run more on autopilot',
    desc: 'Reminders, scheduling, revenue forecasting — the admin handles itself so you stay focused on the work.',
  },
]

const INDUSTRIES = [
  'Pressure Washing', 'Landscaping', 'House Cleaning', 'Mobile Detailing',
  'Pest Control', 'Pool Service', 'Window Cleaning', 'Junk Removal',
  'HVAC', 'Painting', 'Roofing', 'Lawn Care',
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EarlyAccessPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <PublicNav />

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-blue-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-indigo-700/12 blur-[120px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

              {/* Left — copy */}
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span className="text-[12px] font-semibold text-blue-300 tracking-wide">
                    AI-Powered · Built for Service Businesses
                  </span>
                </div>

                <h1 className="text-[40px] sm:text-[52px] lg:text-[58px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  The AI operating<br className="hidden sm:block" /> system for service<br className="hidden sm:block" /> businesses.{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Coming soon.
                  </span>
                </h1>

                <p className="text-[17px] text-white/50 leading-relaxed max-w-[480px] mb-9">
                  Automax is currently in development — an all-in-one platform that
                  helps service businesses capture leads, send quotes, automate
                  follow-up, and grow their reputation with AI.
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  <Link href="/waitlist" className={BLUE_BTN}>
                    Join the Waitlist <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/features" className={GHOST_BTN}>
                    See What&apos;s Coming
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Early access pricing', 'No commitment required', 'Be first in line'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/35">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — product mock */}
              <div className="relative flex items-center justify-center lg:justify-end pt-10 pb-10">
                <ProductMock />
              </div>
            </div>
          </div>

          <div className="h-20 bg-gradient-to-b from-transparent to-[#0a1120]" />
        </section>

        {/* ── FEATURES PREVIEW ──────────────────────────────────────────── */}
        <section className="relative bg-[#0a1120] py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/6 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5 mb-5">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="text-[12px] font-semibold text-blue-300 tracking-wide">What Automax Will Do</span>
              </div>
              <h2 className="text-[30px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Everything your business needs.<br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Nothing you don&apos;t.
                </span>
              </h2>
              <p className="mt-4 text-[16px] text-white/40 max-w-xl mx-auto leading-relaxed">
                Automax replaces the patchwork of tools most service businesses rely on —
                one connected system that runs in the background while you stay on the job.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(f => {
                const Icon = f.icon
                return (
                  <div
                    key={f.title}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 hover:border-blue-500/30 hover:bg-blue-500/[0.04] transition-all duration-200"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color} mb-5`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-[13px] text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-10">
              <Link href="/features" className={GHOST_BTN}>
                See the full platform overview <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── BUILT FOR ─────────────────────────────────────────────────── */}
        <section className="relative bg-[#080f1e] py-20 sm:py-24 overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-blue-700/8 blur-[100px]" />

          <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5 mb-5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="text-[12px] font-semibold text-blue-300 tracking-wide">Built for Service Businesses</span>
            </div>

            <h2 className="text-[30px] sm:text-[40px] font-bold tracking-tight text-white leading-tight mb-4">
              If you do the work, we&apos;ll handle the rest.
            </h2>
            <p className="text-[16px] text-white/40 leading-relaxed max-w-2xl mx-auto mb-12">
              Automax is purpose-built for field service businesses — not a generic CRM
              with service features bolted on. Built from the ground up for the way this
              industry actually operates.
            </p>

            <div className="flex flex-wrap gap-2.5 justify-center mb-4">
              {INDUSTRIES.map(industry => (
                <div
                  key={industry}
                  className="rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-[13px] font-medium text-white/50 hover:border-blue-500/25 hover:text-white/70 hover:bg-blue-500/[0.05] transition-all duration-150"
                >
                  {industry}
                </div>
              ))}
            </div>
            <p className="text-[12px] text-white/20">And many more.</p>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="relative bg-[#0a1120] overflow-hidden py-24 sm:py-32">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/8 to-transparent" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-blue-600/10 blur-[100px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />

          <div className="relative mx-auto max-w-3xl px-5 sm:px-6 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/[0.08] px-3.5 py-1.5 mb-7">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
              </span>
              <span className="text-[11px] font-semibold text-amber-300 tracking-wide">Currently in Development</span>
            </div>

            <h2 className="text-[36px] sm:text-[50px] font-bold text-white tracking-tight leading-[1.08] mb-5">
              Get in early.<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Shape what we build.
              </span>
            </h2>

            <p className="text-[17px] text-white/45 mb-10 max-w-xl mx-auto leading-relaxed">
              We&apos;re in active development and onboarding a small number of early access partners.
              Join the waitlist to get updates, early access pricing, and the chance to influence the
              product roadmap.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/waitlist" className={BLUE_BTN} style={{ fontSize: '15px', padding: '14px 32px' }}>
                Join the Waitlist <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/features" className={GHOST_BTN} style={{ fontSize: '15px', padding: '14px 28px' }}>
                See What&apos;s Coming
              </Link>
            </div>

            <p className="mt-6 text-[12px] text-white/20">
              No credit card. No commitment. Just early access.
            </p>
          </div>
        </section>

        <PublicFooter />
      </div>
    </MarketingShell>
  )
}
