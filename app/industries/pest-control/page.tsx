import Link from 'next/link'
import { ArrowRight, Check, Bug, MapPin, Calendar, MessageSquare, FileText, Star, TrendingUp } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function PestControlPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-orange-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-red-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Industries · Pest Control</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Pest control runs on<br />
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  speed and follow-through.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Customers call when they have a problem — and they need a response fast. Automax makes sure every lead gets an instant reply, a professional quote, and a follow-up sequence that closes the job.
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
                {['Service-specific quote templates', 'Recurring treatment scheduling', 'AI-assisted lead response'].map(f => (
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
          { value: '< 60s', label: 'AI response to new leads' },
          { value: '3x',    label: 'More recurring plans booked' },
          { value: '4.8★',  label: 'Review rating after automation' },
          { value: '30%',   label: 'Higher avg ticket with upsells' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Built for pest pros</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                From urgent call to<br className="hidden sm:block" />
                long-term client.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Pest control is equal parts urgency response and recurring revenue. Automax handles both ends of the business.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: MessageSquare, color: 'bg-orange-500/15 text-orange-400',
                  title: 'Instant Lead Response',
                  desc: 'A customer reports a roach problem at 9pm. Automax responds within 60 seconds, captures details, and gets them booked — before they call a competitor.',
                },
                {
                  icon: FileText, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Treatment-Specific Quotes',
                  desc: 'Pre-built templates for rodents, insects, termites, bed bugs, and quarterly programs. Send a professional quote in under 2 minutes from your phone.',
                },
                {
                  icon: Calendar, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Recurring Treatment Plans',
                  desc: 'Set up monthly, bi-monthly, or quarterly visit schedules once. Automax sends reminders, confirms appointments, and keeps the plan on track.',
                },
                {
                  icon: MapPin, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Route Optimization',
                  desc: 'Group service stops by neighborhood to minimize drive time between jobs. More stops per day, lower fuel costs, higher margin.',
                },
                {
                  icon: TrendingUp, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Upsell Recurring Plans',
                  desc: 'After a one-time treatment, Automax automatically offers a quarterly protection plan. Turn emergency calls into long-term recurring revenue.',
                },
                {
                  icon: Star, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Automatic Review Requests',
                  desc: 'After every service visit, Automax sends a review request via text. Build your Google reputation without any manual effort.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-orange-500/25 hover:bg-orange-500/[0.04] transition-all duration-200">
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
              <SectionLabel>How pest pros use it</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From emergency call to annual plan.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Urgent Lead Comes In', desc: 'AI responds instantly, asks about pest type and property, and offers available same-day or next-day slots.' },
                { num: '02', title: 'Quote Sent Fast', desc: 'Treatment quote sent in under 2 minutes. Customer approves and pays a deposit from their phone.' },
                { num: '03', title: 'Job Completed', desc: 'Technician marks it done. Review request fires automatically 24 hours later. Satisfaction check built in.' },
                { num: '04', title: 'Recurring Plan Offered', desc: 'Automax follows up with a recurring protection plan offer. Most one-time customers convert within 30 days.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-orange-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>More recurring plans.<br /><span className="text-orange-400">Less chasing leads.</span></>}
          sub="Pest control businesses on Automax respond faster, close more recurring plans, and spend less time on admin."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
