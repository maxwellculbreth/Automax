import Link from 'next/link'
import { ArrowRight, Check, Car, MapPin, Calendar, DollarSign, Star, Smartphone, TrendingUp } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function MobileDetailingPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-amber-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-orange-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Industries · Mobile Detailing</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Mobile detailing runs better<br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  when your system moves with you.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                You're on the road all day. Automax works on your phone, handles the bookings, and keeps the revenue flowing — so you can stay focused on the detail work.
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
                {['Mobile-first design', 'Route optimization built in', 'Collect payment on the spot'].map(f => (
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
          { value: '45%',  label: 'Less drive time with routing' },
          { value: '$180', label: 'Higher avg ticket with upsells' },
          { value: '< 2m', label: 'To send a quote from your phone' },
          { value: '5★',   label: 'Reviews on autopilot' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Built for detailers</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Your business in your pocket.<br className="hidden sm:block" />
                Wherever the job takes you.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Detailers don't sit at a desk. Automax is built for people who are always moving.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Smartphone, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Mobile-First Everything',
                  desc: 'Quote, schedule, message clients, and collect payment — all from your phone, in seconds, between jobs.',
                },
                {
                  icon: MapPin, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Route Optimization',
                  desc: 'Stack your day with jobs in the same area. Less driving, more detailing. Your routing is optimized automatically.',
                },
                {
                  icon: DollarSign, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Collect Payment On the Spot',
                  desc: 'Send a payment link when the job is done. Clients tap, pay, and you\'re done — no invoices to chase later.',
                },
                {
                  icon: TrendingUp, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Smart Upsells',
                  desc: 'AI surfaces relevant add-ons based on the client\'s vehicle and history. Interior + exterior, wax, ceramic coating — more per visit.',
                },
                {
                  icon: Calendar, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Return Booking Triggers',
                  desc: 'After 3 months, Automax automatically reaches out to past clients. Your book fills up without a single marketing dollar spent.',
                },
                {
                  icon: Star, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Review After Every Detail',
                  desc: 'When a client pays, a review request fires automatically. Build a 5-star reputation that keeps your schedule full.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-amber-500/25 hover:bg-amber-500/[0.04] transition-all duration-200">
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
              <SectionLabel>How detailers use it</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From booking to five stars.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Lead Comes In', desc: 'AI responds instantly, asks about vehicle type and services needed, and offers available time slots.' },
                { num: '02', title: 'Route is Built', desc: 'Job is added to your day. Automax groups it with nearby appointments so you\'re never driving across town.' },
                { num: '03', title: 'Job is Done', desc: 'Mark it complete in the app. Payment link fires automatically. Collect it on site or they pay from their phone.' },
                { num: '04', title: 'They Come Back', desc: 'Three months later, they get a gentle reminder. Most book again. Your calendar stays full year-round.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-amber-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>More jobs per day.<br /><span className="text-amber-400">More revenue per job.</span></>}
          sub="Mobile detailers on Automax spend less time on admin and more time doing work that pays."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
