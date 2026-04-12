import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Users,
  FileText,
  Zap,
  Star,
  TrendingUp,
  Bot,
  BarChart2,
  Calendar,
} from 'lucide-react'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PublicNav } from '@/components/public/public-nav'
import { PublicFooter } from '@/components/public/public-footer'

export const metadata: Metadata = {
  title: "What's Coming — Automax",
  description:
    'An early look at the full Automax platform — lead capture, AI follow-up, quoting, pipeline management, reviews automation, and a real-time business dashboard.',
}

// ── Shared tokens ─────────────────────────────────────────────────────────────

const BLUE_BTN =
  'inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-[14px] font-semibold text-white shadow-[0_2px_14px_rgba(59,130,246,0.40)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_24px_rgba(59,130,246,0.55)] hover:-translate-y-px active:translate-y-0 transition-all duration-150'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5">
      <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
      <span className="text-[12px] font-semibold text-blue-300 tracking-wide">{children}</span>
    </div>
  )
}

// ── Feature cards ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Users,
    color: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    num: '01',
    title: 'Lead Inbox & CRM',
    tagline: 'Every lead. One place. Instant response.',
    desc: 'Every inbound lead — web form, Google, phone call, text — lands in a unified inbox. The AI responds within 60 seconds, asks qualifying questions, and moves them into your pipeline automatically. Nothing gets missed.',
    bullets: [
      'AI responds to new leads in under 60 seconds',
      'Unified inbox across all lead sources',
      'Automatic pipeline entry and tagging',
      'Full client history and conversation log',
    ],
  },
  {
    icon: Bot,
    color: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
    num: '02',
    title: 'AI Follow-Up & Automation',
    tagline: 'Zero leads go cold. Zero manual effort.',
    desc: 'Quotes that go unread get automatic follow-ups. Cold leads get re-engagement sequences. Review requests go out 24 hours after a job is marked complete. Every automation pauses the moment the contact responds.',
    bullets: [
      'Automated quote follow-up sequences',
      'Cold lead re-engagement campaigns',
      'SMS review requests after job completion',
      'Smart pause — stops immediately on any reply',
    ],
  },
  {
    icon: FileText,
    color: 'bg-violet-500/10 text-violet-400 ring-violet-500/20',
    num: '03',
    title: 'Quotes & Payments',
    tagline: 'Professional quotes in under 60 seconds.',
    desc: 'Describe the job and Automax AI drafts a polished, line-item quote based on your pricing history. You review and send in one click. Clients approve on their phone, pay a deposit, and you get notified instantly.',
    bullets: [
      'AI-drafted line-item quotes from job descriptions',
      'Professional branded quote delivery via SMS or email',
      'Online approval and deposit collection',
      'Automatic follow-up if quote goes unread',
    ],
  },
  {
    icon: Calendar,
    color: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    num: '04',
    title: 'Pipeline & Job Management',
    tagline: 'From new lead to completed job — fully tracked.',
    desc: 'Every deal moves through a clear pipeline: Lead → Quoted → Scheduled → In Progress → Complete. Jobs include client info, service details, notes, and crew assignment. Route optimization and appointment reminders are built in.',
    bullets: [
      'Visual kanban pipeline for every stage',
      'Job board with crew assignment and scheduling',
      'Automated appointment confirmations and reminders',
      'Route optimization for field crew',
    ],
  },
  {
    icon: Star,
    color: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    num: '05',
    title: 'Reviews & Reputation',
    tagline: 'Watch your Google rating climb on its own.',
    desc: 'After every completed job, Automax sends a review request via SMS. No setup, no reminders to yourself, no awkward asks — it just happens. Contractors typically see their review count multiply within 90 days.',
    bullets: [
      'Automated SMS review requests after job completion',
      'Customizable message timing and copy',
      'Review performance tracking in the dashboard',
      'Helps dominate local Google search results',
    ],
  },
  {
    icon: BarChart2,
    color: 'bg-teal-500/10 text-teal-400 ring-teal-500/20',
    num: '06',
    title: 'Business Dashboard & AI Insights',
    tagline: 'Know exactly where your business stands.',
    desc: 'Revenue, open quotes, booked jobs, pipeline value, and conversion rates — all visible at a glance, updated in real-time. AI analyzes your pipeline and seasonal patterns to forecast next month\'s revenue so you can plan ahead.',
    bullets: [
      'Real-time revenue and KPI dashboard',
      'Pipeline value and conversion tracking',
      'AI revenue forecasting based on historical patterns',
      'Expense tracking and profit margin visibility',
    ],
  },
]

const INDUSTRIES = [
  'Pressure Washing',
  'Landscaping',
  'House Cleaning',
  'Mobile Detailing',
  'Pest Control',
  'Pool Service',
  'Window Cleaning',
  'Junk Removal',
  'HVAC',
  'Painting',
  'Roofing',
  'Lawn Care',
  'General Contracting',
  'Moving Services',
]

const WHY_STATS = [
  {
    metric: '< 60s',
    label: 'AI response time',
    desc: 'Automax responds to every new inbound lead in under 60 seconds — even at 2am on a Saturday.',
    accent: true,
  },
  {
    metric: '1',
    label: 'System, not six',
    desc: 'Replace the patchwork of apps most service businesses rely on with one connected platform.',
    accent: false,
  },
  {
    metric: '0',
    label: 'Leads lost to slow follow-up',
    desc: 'Automated sequences keep every lead warm until they book, reply, or opt out — nothing falls through.',
    accent: false,
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <PublicNav />

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-blue-700/15 blur-[150px]" />
          <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/10 blur-[120px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

          <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
            <div className="mb-6">
              <SectionLabel>Platform Overview · In Development</SectionLabel>
            </div>

            <h1 className="text-[38px] sm:text-[54px] lg:text-[62px] font-bold text-white tracking-tight leading-[1.06] mb-6">
              One system to run<br className="hidden sm:block" /> the whole operation.
            </h1>

            <p className="text-[17px] sm:text-[18px] text-white/45 leading-relaxed max-w-2xl mx-auto mb-10">
              An early look at what Automax is building — a fully connected platform that handles the
              lead-to-cash flow for service businesses, powered by AI at every step.
            </p>

            <Link href="/waitlist" className={BLUE_BTN} style={{ fontSize: '15px', padding: '14px 28px' }}>
              Join the Waitlist <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="h-12 bg-gradient-to-b from-transparent to-[#0a1120]" />
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────────── */}
        <section className="bg-[#0a1120] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                const isEven = i % 2 === 0

                return (
                  <div
                    key={f.num}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 sm:p-9 hover:border-blue-500/20 hover:bg-blue-500/[0.025] transition-all duration-200"
                  >
                    <div className={`grid lg:grid-cols-[1fr_320px] gap-8 items-start ${!isEven ? 'lg:grid-cols-[320px_1fr]' : ''}`}>

                      {/* Content */}
                      <div className={!isEven ? 'lg:order-2' : ''}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${f.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-[11px] font-bold text-blue-500/50 tracking-wider">{f.num}</span>
                        </div>

                        <h2 className="text-[22px] sm:text-[26px] font-bold text-white mb-1.5 tracking-tight">
                          {f.title}
                        </h2>
                        <p className="text-[14px] font-medium text-blue-300/60 mb-4">{f.tagline}</p>
                        <p className="text-[15px] text-white/45 leading-relaxed mb-6 max-w-xl">
                          {f.desc}
                        </p>
                      </div>

                      {/* Bullets */}
                      <div className={`${!isEven ? 'lg:order-1' : ''} rounded-xl border border-white/[0.06] bg-white/[0.03] p-5`}>
                        <ul className="space-y-3">
                          {f.bullets.map(bullet => (
                            <li key={bullet} className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/15 ring-1 ring-blue-500/20">
                                <Check className="h-3 w-3 text-blue-400" />
                              </span>
                              <span className="text-[13px] text-white/60 leading-snug">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── WHY AUTOMAX ───────────────────────────────────────────────── */}
        <section className="relative bg-[#080f1e] py-20 sm:py-24 overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px] rounded-full bg-blue-700/8 blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Why Automax</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[40px] font-bold text-white tracking-tight leading-tight">
                Built for speed. Built for service.
              </h2>
              <p className="mt-3 text-[16px] text-white/40 max-w-xl mx-auto leading-relaxed">
                Most service businesses lose leads because they responded too slowly, followed up too late, or used too many disconnected tools. Automax fixes all three.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {WHY_STATS.map(s => (
                <div
                  key={s.metric}
                  className={`rounded-2xl border p-7 ${
                    s.accent
                      ? 'border-blue-500/25 bg-blue-500/[0.06]'
                      : 'border-white/[0.07] bg-white/[0.025]'
                  }`}
                >
                  <div className={`text-[44px] font-bold tracking-tight leading-none mb-1 ${s.accent ? 'text-blue-400' : 'text-white'}`}>
                    {s.metric}
                  </div>
                  <div className="text-[13px] font-semibold text-white/55 mb-3">{s.label}</div>
                  <p className="text-[13px] text-white/35 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BUILT FOR ─────────────────────────────────────────────────── */}
        <section className="bg-[#0a1120] py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 text-center">
            <SectionLabel>Built for Service Businesses</SectionLabel>
            <h2 className="mt-4 text-[28px] sm:text-[38px] font-bold text-white tracking-tight leading-tight mb-4">
              If you do the work, Automax handles the rest.
            </h2>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-2xl mx-auto mb-10">
              Purpose-built for field service businesses that need their tools to work as hard as they do. Not a generic CRM with service features bolted on — built from the ground up for the way this industry actually operates.
            </p>

            <div className="flex flex-wrap gap-2.5 justify-center mb-6">
              {INDUSTRIES.map(industry => (
                <div
                  key={industry}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/50"
                >
                  {industry}
                </div>
              ))}
            </div>

            <p className="text-[12px] text-white/20">
              And more — if you run a service business, Automax is built for you.
            </p>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="relative bg-[#080f1e] overflow-hidden py-24 sm:py-32">
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
              <span className="text-[11px] font-semibold text-amber-300 tracking-wide">
                Currently in Development
              </span>
            </div>

            <h2 className="text-[34px] sm:text-[48px] font-bold text-white tracking-tight leading-[1.08] mb-5">
              Be first in line<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                when we launch.
              </span>
            </h2>

            <p className="text-[17px] text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
              Join the waitlist to lock in early access pricing and get a hands-on onboarding when Automax is ready for partners.
            </p>

            <Link href="/waitlist" className={BLUE_BTN} style={{ fontSize: '15px', padding: '14px 32px' }}>
              Join the Waitlist <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-5 text-[12px] text-white/20">
              No credit card. No commitment. Just early access.
            </p>
          </div>
        </section>

        <PublicFooter />
      </div>
    </MarketingShell>
  )
}
