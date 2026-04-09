import Link from 'next/link'
import { ArrowRight, Check, Droplets, FileText, MessageSquare, Star, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function PressureWashingPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-cyan-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Industries · Pressure Washing</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                The CRM built for<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  pressure washing pros.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                From house wash quotes to roof treatment upsells — Automax is built around how wash businesses actually operate. More jobs, less admin, better reviews.
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
                {['Service-specific quote templates', 'Automatic review requests', 'Seasonal re-engagement built in'].map(f => (
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
          { value: '500+',  label: 'Wash businesses on Automax' },
          { value: '$2,400', label: 'Avg monthly revenue added' },
          { value: '4.9★',  label: 'Review rating improvement' },
          { value: '40%',   label: 'Fewer no-shows after reminders' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Built for wash pros</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Everything a wash business<br className="hidden sm:block" />
                needs. Nothing it doesn't.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Automax is used by pressure washing companies from solo operators to 10-truck crews. Here's what they use every day.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: FileText, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Service-Type Quote Templates',
                  desc: 'Pre-built templates for house wash, driveway, roof treatment, deck cleaning, and more — with line items and pricing built in.',
                },
                {
                  icon: MessageSquare, color: 'bg-violet-500/15 text-violet-400',
                  title: 'AI Lead Response',
                  desc: 'New leads from Google or your website get an instant reply that asks the right questions — surface size, service type, urgency.',
                },
                {
                  icon: Star, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Post-Job Review Requests',
                  desc: 'When a job is marked complete, Automax automatically sends a review request via text. Get more 5-star reviews without asking manually.',
                },
                {
                  icon: Calendar, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Seasonal Re-Engagement',
                  desc: 'Spring is your biggest season. Automax automatically reaches out to past clients before the rush — before your competitors do.',
                },
                {
                  icon: DollarSign, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Upsell Built In',
                  desc: 'When a customer books a house wash, Automax surfaces driveway and gutter add-ons. Average job value goes up without the hard sell.',
                },
                {
                  icon: TrendingUp, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Revenue Dashboard',
                  desc: 'Track jobs by service type, average ticket, and revenue per month. Know which services are growing and which need attention.',
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

        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>How wash pros use it</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From inquiry to 5-star review.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Lead Comes In', desc: 'AI replies instantly, asks about property type and services needed, and schedules a quote or site visit.' },
                { num: '02', title: 'Quote is Sent', desc: 'You send a professional, line-item quote in 60 seconds from your phone. Customer approves with one tap.' },
                { num: '03', title: 'Job is Scheduled', desc: 'Confirmation text sent automatically. Route-optimized time slot booked. Reminders go out the day before.' },
                { num: '04', title: 'Review is Requested', desc: 'Job marked complete. Review request fires automatically. 4.9 stars and growing.' },
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
          headline={<>More washes.<br /><span className="text-blue-400">Less admin.</span></>}
          sub="Join 500+ pressure washing businesses already using Automax to fill their schedule and grow their reputation."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
