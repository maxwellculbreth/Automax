import Link from 'next/link'
import { ArrowRight, Check, Waves, Calendar, Repeat, FileText, MessageSquare, Star, MapPin } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function PoolServicePage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-cyan-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-teal-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Industries · Pool Service</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Pool service is all recurring.<br />
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Run it like it.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Weekly routes, seasonal openings and closings, equipment repairs — Automax keeps your schedule tight, your clients informed, and your revenue predictable year-round.
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
                {['Weekly route management', 'Seasonal opening & closing reminders', 'Repair quote templates'].map(f => (
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
          { value: '95%',  label: 'Client retention on recurring routes' },
          { value: '6h+',  label: 'Admin time saved per week' },
          { value: '$400', label: 'Avg upsell per seasonal opening' },
          { value: '4.9★', label: 'Average Google rating' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Built for pool pros</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Every route. Every season.<br className="hidden sm:block" />
                Every client.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Pool service businesses live on predictable recurring routes and seasonal spikes. Automax is built to maximize both.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Repeat, color: 'bg-cyan-500/15 text-cyan-400',
                  title: 'Weekly Route Automation',
                  desc: 'Set up recurring service routes once. Automax schedules every future visit, sends client reminders, and tracks completion — automatically.',
                },
                {
                  icon: MapPin, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Route Optimization',
                  desc: 'Group your weekly stops by neighborhood. Spend less time driving and more time servicing. Routes update automatically as you add new clients.',
                },
                {
                  icon: Calendar, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Seasonal Campaign Triggers',
                  desc: 'Spring openings and fall closings are your biggest revenue days. Automax reaches out to every client before the season — before they book someone else.',
                },
                {
                  icon: FileText, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Repair & Service Quotes',
                  desc: 'Templates for equipment repairs, chemical treatments, filter replacements, and seasonal work. Professional quotes sent in minutes, approved on the spot.',
                },
                {
                  icon: MessageSquare, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'AI Lead Qualification',
                  desc: 'New leads get an instant reply that asks about pool size, current service provider, and service type — so you show up to every quote call prepared.',
                },
                {
                  icon: Star, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Post-Visit Review Requests',
                  desc: 'After every service visit, Automax sends a review request via text. Grow your star rating without any manual work.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-cyan-500/25 hover:bg-cyan-500/[0.04] transition-all duration-200">
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
              <SectionLabel>How pool pros use it</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From new client to full route.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'New Lead Responds', desc: 'AI qualifies the lead — pool size, location, service needed. You get a ready-to-close prospect, not a cold caller.' },
                { num: '02', title: 'Route Slot Booked', desc: 'Quote approved. Client is added to your weekly route in the nearest neighborhood cluster. Zero manual scheduling.' },
                { num: '03', title: 'Season Change Triggers', desc: 'Spring opening campaign fires automatically before the season. Every past client gets a personalized outreach.' },
                { num: '04', title: 'Repair Upsell Sent', desc: 'Equipment issue flagged during a visit? Quote generated and sent instantly. Most clients approve the same day.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-cyan-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Full routes.<br /><span className="text-cyan-400">All season.</span></>}
          sub="Pool service businesses on Automax run tighter routes, retain more clients, and never miss a seasonal revenue opportunity."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
