import Link from 'next/link'
import { ArrowRight, Check, LayoutDashboard, Zap, Users, FileText, TrendingUp, Bell } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function CRMMock() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-blue-600/12 blur-[70px] rounded-full" />

      {/* Main panel */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35 tracking-tight">Automax · CRM Overview</div>
        </div>

        <div className="p-4">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Active Leads', value: '24',      color: 'text-blue-400' },
              { label: 'Revenue MTD',  value: '$18,420', color: 'text-white' },
              { label: 'Jobs Booked',  value: '31',      color: 'text-emerald-400' },
              { label: 'Open Quotes',  value: '9',       color: 'text-amber-400' },
            ].map(k => (
              <div key={k.label} className="rounded-xl border border-white/8 bg-[#0a1525] px-2.5 py-2">
                <div className="text-[9.5px] text-white/30 mb-1 leading-tight">{k.label}</div>
                <div className={`text-[13px] font-bold tabular-nums ${k.color}`}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Two-col content */}
          <div className="grid grid-cols-[1fr_1fr] gap-3">
            {/* Pipeline column */}
            <div>
              <div className="text-[9.5px] font-semibold uppercase tracking-widest text-white/25 mb-2">Pipeline</div>
              {[
                { stage: 'New Leads',  count: 8,  bar: 'bg-blue-500', w: '75%' },
                { stage: 'Quoted',     count: 9,  bar: 'bg-violet-500', w: '85%' },
                { stage: 'Scheduled',  count: 6,  bar: 'bg-emerald-500', w: '55%' },
                { stage: 'Completed',  count: 31, bar: 'bg-teal-500', w: '100%' },
              ].map(row => (
                <div key={row.stage} className="flex items-center gap-2 mb-2.5 last:mb-0">
                  <div className="text-[11px] text-white/50 w-20 flex-shrink-0">{row.stage}</div>
                  <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div className={`h-full rounded-full ${row.bar}`} style={{ width: row.w }} />
                  </div>
                  <div className="text-[11px] font-semibold text-white/60 w-5 text-right">{row.count}</div>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div>
              <div className="text-[9.5px] font-semibold uppercase tracking-widest text-white/25 mb-2">Recent Activity</div>
              <div className="space-y-2">
                {[
                  { text: 'Quote sent to Marcus T.', time: '2m', dot: 'bg-blue-400' },
                  { text: 'Lead replied — Jordan M.', time: '5m', dot: 'bg-emerald-400' },
                  { text: 'Job completed — Angela S.', time: '1h', dot: 'bg-teal-400' },
                  { text: 'Review request sent', time: '1h', dot: 'bg-amber-400' },
                  { text: 'New lead from website', time: '2h', dot: 'bg-violet-400' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${a.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white/65 leading-snug truncate">{a.text}</div>
                    </div>
                    <div className="text-[10px] text-white/25 flex-shrink-0">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating — AI Alert */}
      <div className="absolute -top-5 -right-3 sm:-right-5 w-[180px] rounded-xl border border-blue-500/25 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/20">
            <Zap className="h-3 w-3 text-blue-400" />
          </div>
          <span className="text-[11px] font-semibold text-white">AI Reply Sent</span>
        </div>
        <div className="text-[10.5px] text-white/45 leading-snug">Marcus T. responded in &lt;60s</div>
      </div>

      {/* Floating — Win */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 w-[174px] rounded-xl border border-emerald-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20">
            <Check className="h-3 w-3 text-emerald-400" />
          </div>
          <span className="text-[11px] font-semibold text-white">Deal Closed</span>
        </div>
        <div className="text-[14px] font-bold text-white">$2,100</div>
        <div className="text-[10px] text-emerald-400 mt-0.5">Deposit collected</div>
      </div>
    </div>
  )
}

export default function CRMOverviewPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-5">
                  <SectionLabel>Platform · CRM Overview</SectionLabel>
                </div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  One system.<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Every moving part.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Automax CRM is your command center — leads, quotes, clients, jobs, and revenue all in one place, updated in real time, with AI handling the busywork.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>
                    View Pricing
                  </Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['No credit card required', 'Setup in under 10 minutes', 'Cancel anytime'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <CRMMock />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <StatStrip stats={[
          { value: '500+', label: 'Active businesses' },
          { value: '< 60s', label: 'Avg. AI response time' },
          { value: '$8M+', label: 'Quotes sent monthly' },
          { value: '40%', label: 'Revenue lift on average' },
        ]} />

        {/* ── Benefits ──────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Why it works</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Built for how service<br className="hidden sm:block" />
                businesses actually operate.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Not a generic CRM with a "service mode." Built from scratch for contractors, cleaners, detailers, and landscapers.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: LayoutDashboard, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Full Pipeline Visibility',
                  desc: 'See every lead, quote, and job in one unified view. Know exactly where every dollar is at any moment.',
                },
                {
                  icon: Zap, color: 'bg-violet-500/15 text-violet-400',
                  title: 'AI-Powered Responses',
                  desc: 'New leads get instant replies — even at midnight. AI qualifies the job, gathers details, and keeps them warm until you\'re ready.',
                },
                {
                  icon: FileText, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Quotes in Under 60 Seconds',
                  desc: 'Create and send professional, line-item quotes from your phone or desktop. Follow-ups send themselves if they go unopened.',
                },
                {
                  icon: Users, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Complete Client Records',
                  desc: 'Every job, message, quote, and payment lives under each client profile. No spreadsheets. No chasing history.',
                },
                {
                  icon: TrendingUp, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Real-Time Revenue Tracking',
                  desc: 'Revenue MTD, close rate, pipeline value, and job velocity — visible at a glance so you always know where you stand.',
                },
                {
                  icon: Bell, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Smart Alerts & Reminders',
                  desc: 'Never drop the ball. Automax surfaces overdue follow-ups, unread quotes, and jobs that need attention — automatically.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-blue-500/25 hover:bg-blue-500/[0.04] transition-all duration-200">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color} mb-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-[13px] text-white/45 leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From first contact to final payment.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Lead Comes In', desc: 'Via your website, text, or Google. AI responds instantly and qualifies the request.' },
                { num: '02', title: 'Quote is Sent', desc: 'Line-item quote built in seconds. Customer approves on their phone with one tap.' },
                { num: '03', title: 'Job is Scheduled', desc: 'Automatic confirmation texts, reminders, and route planning — no back-and-forth.' },
                { num: '04', title: 'Job is Closed', desc: 'Payment collected, review requested, client record updated. Repeat automatically.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-blue-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Your whole business.<br /><span className="text-blue-400">One screen.</span></>}
          sub="Join 500+ service businesses already using Automax to close more jobs and stay organized."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
