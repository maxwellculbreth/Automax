import Link from 'next/link'
import { ArrowRight, Check, TrendingUp, BarChart2, PieChart, DollarSign, Target, AlertCircle, Calendar } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function RevenueInsightsPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-teal-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-blue-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Automation · Revenue Insights</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Know where your<br />
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  business is headed.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Stop guessing about revenue. Automax tracks every dollar, surfaces trends you'd miss, and forecasts what's coming — so you can make confident decisions.
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
                {['Real-time revenue tracking', 'Forecast next 30-90 days', 'Service-level profitability'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                    <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '$8M+',  label: 'Revenue tracked monthly' },
          { value: '92%',   label: 'Forecast accuracy' },
          { value: '3.2x',  label: 'Better decisions with data' },
          { value: 'Live',  label: 'Real-time dashboard updates' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What it does</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Every number that matters.<br className="hidden sm:block" />
                Always up to date.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Revenue Insights turns your job and payment data into clear, actionable intelligence — no spreadsheets, no manual exports.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: BarChart2, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Real-Time Revenue Dashboard',
                  desc: 'Revenue MTD, YTD, pipeline value, and close rate — visible at a glance and updated the moment a payment lands.',
                },
                {
                  icon: TrendingUp, color: 'bg-emerald-500/15 text-emerald-400',
                  title: '30/60/90-Day Forecasts',
                  desc: 'Based on your pipeline and historical patterns, Automax projects your revenue so you can plan crew capacity and expenses.',
                },
                {
                  icon: PieChart, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Service-Level Profitability',
                  desc: 'See which services generate the most profit per hour — not just per job. Know exactly where to focus your sales effort.',
                },
                {
                  icon: DollarSign, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Expense vs. Revenue Tracking',
                  desc: 'Log expenses and see real profit margins — not just gross revenue. Know your true take-home before the month ends.',
                },
                {
                  icon: AlertCircle, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Anomaly Alerts',
                  desc: 'Automax flags unusual drops in close rate, revenue pace, or average job value before they turn into bigger problems.',
                },
                {
                  icon: Calendar, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Seasonal Trend Analysis',
                  desc: 'Compare this month to the same period last year. Understand your slow season, plan for your peak, and grow year-over-year.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-teal-500/25 hover:bg-teal-500/[0.04] transition-all duration-200">
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

        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                Your data works for you automatically.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Data Flows In', desc: 'Every quote, job, and payment is automatically recorded in Automax — no manual entry needed.' },
                { num: '02', title: 'Metrics Are Calculated', desc: 'Revenue, margins, close rates, and job velocity are updated in real time on your dashboard.' },
                { num: '03', title: 'Trends Surface', desc: 'Automax highlights what\'s growing, what\'s declining, and what needs your attention this week.' },
                { num: '04', title: 'You Make the Call', desc: 'With clear data in front of you, every decision — pricing, hiring, marketing — becomes easier.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-teal-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Run your business<br /><span className="text-teal-400">on real numbers.</span></>}
          sub="Stop guessing. Start growing. Automax turns your job data into the decisions that matter."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
