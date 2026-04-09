import Link from 'next/link'
import { ArrowRight, Check, BarChart2, TrendingUp, Bell, Target, Eye, Zap } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function DashboardMock() {
  const bars = [55, 70, 60, 85, 75, 90, 80, 95, 88, 100, 92, 78]

  return (
    <div className="relative w-full max-w-[540px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-blue-600/12 blur-[70px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Dashboard</div>
          <div className="ml-auto text-[11px] text-white/25">April 2025</div>
        </div>

        <div className="p-4">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Revenue MTD', value: '$18,420', trend: '+24%', up: true, color: 'text-white' },
              { label: 'Jobs Done',   value: '31',      trend: '+8',   up: true, color: 'text-emerald-400' },
              { label: 'Close Rate',  value: '62%',     trend: '+5%',  up: true, color: 'text-blue-400' },
              { label: 'Avg Job',     value: '$594',    trend: '+$44', up: true, color: 'text-amber-400' },
            ].map(k => (
              <div key={k.label} className="rounded-xl border border-white/8 bg-[#0a1525] px-2.5 py-2">
                <div className="text-[9.5px] text-white/30 mb-1">{k.label}</div>
                <div className={`text-[13px] font-bold tabular-nums ${k.color}`}>{k.value}</div>
                <div className="text-[9.5px] text-emerald-400 mt-0.5 font-medium">↑ {k.trend}</div>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Revenue Trend</div>
              <div className="text-[10px] text-white/25">Last 12 months</div>
            </div>
            <div className="flex items-end gap-1 h-[64px]">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-all ${i === bars.length - 1 ? 'bg-blue-500' : 'bg-white/12'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Action items + Pipeline */}
          <div className="grid grid-cols-[1fr_120px] gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2">Action Items</div>
              <div className="space-y-1.5">
                {[
                  { text: '3 quotes need follow-up', dot: 'bg-amber-400' },
                  { text: '2 jobs scheduled today', dot: 'bg-blue-400' },
                  { text: '5 reviews pending', dot: 'bg-violet-400' },
                  { text: '1 overdue payment', dot: 'bg-red-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                    <div className="text-[11px] text-white/60">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2">Pipeline</div>
              <div className="space-y-1.5">
                {[
                  { label: 'New',      count: 5,  color: 'bg-blue-500' },
                  { label: 'Quoted',   count: 8,  color: 'bg-violet-500' },
                  { label: 'Sched.',   count: 4,  color: 'bg-amber-500' },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-2">
                    <div className="text-[10.5px] text-white/35 w-12">{row.label}</div>
                    <div className="flex-1 h-1.5 rounded-full bg-white/8">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.count * 10}%` }} />
                    </div>
                    <div className="text-[10.5px] text-white/50 w-4 text-right">{row.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating — Revenue up */}
      <div className="absolute -top-5 -right-3 sm:-right-6 w-[172px] rounded-xl border border-emerald-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-white">Revenue Up</span>
        </div>
        <div className="text-[22px] font-bold text-white">+24%</div>
        <div className="text-[10px] text-white/35">vs. last month</div>
      </div>
    </div>
  )
}

export default function BusinessDashboardPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-5"><SectionLabel>Platform · Business Dashboard</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  Your business at<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    a glance.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Revenue, jobs, close rate, pipeline value, and action items — all visible the moment you open Automax. No digging, no spreadsheets. Just clarity.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Real-time KPIs', 'Revenue trend charts', 'Daily action items'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <DashboardMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '< 5s', label: 'To see your full business' },
          { value: '24%', label: 'Avg. revenue lift with data visibility' },
          { value: '12', label: 'KPIs tracked automatically' },
          { value: '0', label: 'Spreadsheets needed' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What you see</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Run your business with data, not gut feeling.
              </h2>
              <p className="mt-3 text-[15px] text-white/45 max-w-xl mx-auto">
                Most service businesses operate blind — they don&apos;t know their close rate, average job size, or where their revenue is trending. Automax changes that on day one.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: BarChart2, color: 'bg-blue-500/15 text-blue-400', title: 'Revenue Dashboard', desc: 'Revenue this month, last month, YTD, and by job type — all tracked automatically without manual entry.' },
                { icon: Target, color: 'bg-violet-500/15 text-violet-400', title: 'Close Rate Tracking', desc: 'Know exactly what percentage of quotes you\'re winning. Track it over time and by lead source to optimize your pitch.' },
                { icon: TrendingUp, color: 'bg-amber-500/15 text-amber-400', title: 'Revenue Forecasting', desc: 'AI analyzes your pipeline and seasonal patterns to project next month\'s revenue — so you can plan ahead.' },
                { icon: Bell, color: 'bg-emerald-500/15 text-emerald-400', title: 'Daily Action Items', desc: 'Quotes that need follow-up, jobs scheduled today, payments overdue — surfaced every morning so nothing is missed.' },
                { icon: Eye, color: 'bg-teal-500/15 text-teal-400', title: 'Pipeline Health Score', desc: 'At-a-glance view of where your leads, quotes, and jobs are stacking up — so you can identify slowdowns before they hurt.' },
                { icon: Zap, color: 'bg-pink-500/15 text-pink-400', title: 'AI-Powered Insights', desc: 'Automax surfaces patterns you\'d never notice manually — your best lead source, peak booking days, and highest-value job types.' },
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

        {/* ── KPIs explained ────────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What we track</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[36px] font-bold text-white tracking-tight">
                Every number that matters to your business.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { metric: 'Revenue MTD / YTD', desc: 'Real cash flow — collected, invoiced, and projected — updated in real time.' },
                { metric: 'Jobs Completed', desc: 'Volume by week and month, broken down by job type and crew member.' },
                { metric: 'Quote Close Rate', desc: 'What % of quotes convert to booked jobs — over time and by lead source.' },
                { metric: 'Pipeline Value', desc: 'Total dollar value of all open leads and quotes in your pipeline right now.' },
                { metric: 'Avg. Job Size', desc: 'Your average revenue per job — tracked over time to show growth trends.' },
                { metric: 'Lead Response Time', desc: 'How fast you (and AI) respond to new leads — a key driver of conversion.' },
                { metric: 'Review Count', desc: 'Google review growth over time, driven by automated post-job requests.' },
                { metric: 'Client Retention', desc: 'Repeat booking rate and client lifetime value — your long-term health score.' },
              ].map(k => (
                <div key={k.metric} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="text-[13px] font-bold text-blue-400 mb-2">{k.metric}</div>
                  <p className="text-[12.5px] text-white/45 leading-snug">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Stop guessing.<br /><span className="text-blue-400">Start knowing.</span></>}
          sub="Get every KPI that matters on your dashboard from day one. Free trial, no credit card."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
