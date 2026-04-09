import Link from 'next/link'
import { ArrowRight, Check, Calculator, TrendingUp, DollarSign, Clock, Users, Star } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

const SCENARIOS = [
  {
    type: 'Solo Operator',
    desc: '1 person, 15–25 jobs/month',
    before: { leads: '18/mo', close: '55%', avgJob: '$280', adminHrs: '12/wk' },
    after:  { leads: '18/mo', close: '81%', avgJob: '$340', adminHrs: '4/wk' },
    lift: '+$2,100/mo',
    color: 'blue',
  },
  {
    type: 'Small Crew',
    desc: '2–4 people, 40–70 jobs/month',
    before: { leads: '45/mo', close: '52%', avgJob: '$320', adminHrs: '18/wk' },
    after:  { leads: '45/mo', close: '78%', avgJob: '$390', adminHrs: '6/wk' },
    lift: '+$5,400/mo',
    color: 'emerald',
  },
  {
    type: 'Growing Company',
    desc: '5–10 people, 100+ jobs/month',
    before: { leads: '90/mo', close: '49%', avgJob: '$380', adminHrs: '30/wk' },
    after:  { leads: '90/mo', close: '76%', avgJob: '$460', adminHrs: '9/wk' },
    lift: '+$14,200/mo',
    color: 'violet',
  },
]

const colorMap: Record<string, { border: string; accent: string; badge: string }> = {
  blue:    { border: 'border-blue-500/20',    accent: 'text-blue-400',    badge: 'bg-blue-500/15 text-blue-300' },
  emerald: { border: 'border-emerald-500/20', accent: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300' },
  violet:  { border: 'border-violet-500/20',  accent: 'text-violet-400',  badge: 'bg-violet-500/15 text-violet-300' },
}

export default function ROICalculatorPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-teal-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Resources · ROI Calculator</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                See how much Automax<br />
                <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  can grow your business.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Based on real data from 500+ businesses, here's what contractors at different stages typically see after switching to Automax.
              </p>
              <div className="flex flex-wrap gap-3 mb-9">
                <Link href="/auth/sign-up" className={BLUE_BTN}>
                  Start Free — See for Yourself <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/resources/book-a-demo" className={GHOST_BTN}>
                  Talk to Us First
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {['Based on real customer data', '14-day free trial to validate', 'No credit card required'].map(f => (
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
          { value: '40%',   label: 'Average revenue lift' },
          { value: '8h+',   label: 'Admin time saved weekly' },
          { value: '+26%',  label: 'Average close rate improvement' },
          { value: '3 mo',  label: 'Typical payback period' },
        ]} />

        {/* ROI scenarios */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>By business size</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                What businesses like yours<br className="hidden sm:block" />
                typically gain.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                These are averages from businesses in our network. Results vary based on your market, services, and how fully you use the platform.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {SCENARIOS.map(s => {
                const colors = colorMap[s.color]
                return (
                  <div key={s.type} className={`rounded-2xl border bg-white/[0.02] p-6 ${colors.border}`}>
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="text-[16px] font-bold text-white">{s.type}</div>
                        <div className="text-[12px] text-white/40 mt-0.5">{s.desc}</div>
                      </div>
                      <div className={`text-[14px] font-bold ${colors.accent}`}>{s.lift}</div>
                    </div>

                    <div className="space-y-3 mb-5">
                      {[
                        { label: 'Monthly leads', before: s.before.leads, after: s.after.leads },
                        { label: 'Close rate', before: s.before.close, after: s.after.close },
                        { label: 'Avg job value', before: s.before.avgJob, after: s.after.avgJob },
                        { label: 'Admin hours/wk', before: s.before.adminHrs, after: s.after.adminHrs },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between">
                          <span className="text-[12px] text-white/40">{row.label}</span>
                          <div className="flex items-center gap-2 text-[12px]">
                            <span className="text-white/30 line-through">{row.before}</span>
                            <span className="text-white/75 font-semibold">{row.after}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`rounded-xl border ${colors.border} p-3 text-center`}>
                      <div className={`text-[22px] font-bold ${colors.accent}`}>{s.lift}</div>
                      <div className="text-[11px] text-white/35 mt-0.5">typical additional monthly revenue</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Where the gains come from */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Where the gains come from</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                Every dollar has a source.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: TrendingUp, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Faster Response = More Closes',
                  desc: 'Leads that get a reply in under 5 minutes are 9x more likely to convert. AI response alone moves close rates by 15–25%.',
                },
                {
                  icon: DollarSign, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Upsells on Every Job',
                  desc: 'Automated add-on suggestions at quote and booking time push average ticket value up by $50–$120 per job, depending on service type.',
                },
                {
                  icon: Users, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Recurring Client Retention',
                  desc: 'Follow-up sequences and re-engagement campaigns keep past clients coming back. Recurring revenue grows by 30–50% in year one.',
                },
                {
                  icon: Clock, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Time Back = More Jobs',
                  desc: 'Saving 8+ hours of admin per week means you can take on 2–4 more jobs — or spend that time on higher-value marketing activities.',
                },
                {
                  icon: Star, color: 'bg-pink-500/15 text-pink-400',
                  title: 'More Reviews = More Leads',
                  desc: 'Better Google reviews lead directly to more inbound leads. Most businesses see 20–40% more organic inquiries after improving their rating.',
                },
                {
                  icon: Calculator, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Fewer Missed Leads',
                  desc: 'On average, businesses miss 30% of leads due to slow response. Fixing that alone can add thousands per month in recovered revenue.',
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

        <PageCTA
          headline={<>The math works.<br /><span className="text-blue-400">Try it free and see.</span></>}
          sub="14-day free trial. Full access. No credit card. See your actual numbers in the first week."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
