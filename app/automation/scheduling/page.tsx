import Link from 'next/link'
import { ArrowRight, Check, Calendar, Clock, MapPin, Bell, Smartphone, Users, Zap } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function SchedulingPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-emerald-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-teal-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Automation · Scheduling</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Your calendar<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  fills itself.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Stop playing phone tag to book jobs. Automax handles scheduling end-to-end — from quote approval to confirmed appointment, with automatic reminders for you and the customer.
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
                {['Auto-confirms appointments', 'SMS reminders sent for you', 'Route-aware scheduling'].map(f => (
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
          { value: '80%',  label: 'Less back-and-forth to book' },
          { value: '< 2m', label: 'Average time to confirm' },
          { value: '35%',  label: 'Fewer no-shows with reminders' },
          { value: '4.8★', label: 'Customer booking experience' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What it does</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Booking that works as hard<br className="hidden sm:block" />
                as you do.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Every step of the booking process — from availability check to appointment confirmation — handled automatically.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Calendar, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Smart Availability',
                  desc: 'Share available slots based on your real schedule. Customers pick a time, and it\'s automatically added to your calendar.',
                },
                {
                  icon: Bell, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Automatic Reminders',
                  desc: 'Customers get an SMS reminder 24 hours and 1 hour before their appointment. You get a heads-up when jobs are coming up.',
                },
                {
                  icon: MapPin, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Route-Aware Booking',
                  desc: 'Schedule jobs near each other on the same day. Less windshield time, more billable hours.',
                },
                {
                  icon: Zap, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Quote-to-Booking in One Step',
                  desc: 'When a quote is approved, scheduling starts automatically. No manual handoff, no lost momentum.',
                },
                {
                  icon: Smartphone, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Customers Book on Their Phone',
                  desc: 'A clean, mobile-first booking experience that works from any SMS or email link. No app download required.',
                },
                {
                  icon: Users, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Multi-Crew Support',
                  desc: 'Assign jobs to specific team members or crews. Everyone has their own schedule view and gets their own reminders.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-emerald-500/25 hover:bg-emerald-500/[0.04] transition-all duration-200">
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
                From quote approved to job on the books.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Quote is Approved', desc: 'Customer signs off on the quote. Automax immediately triggers the scheduling flow.' },
                { num: '02', title: 'Time Slots Offered', desc: 'Customer receives available time slots based on your calendar. They pick what works.' },
                { num: '03', title: 'Confirmed Instantly', desc: 'Both you and the customer get confirmation texts. Job is added to your dashboard.' },
                { num: '04', title: 'Reminders Go Out', desc: 'Automated reminders 24h and 1h before the job. No-shows drop, satisfaction goes up.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-emerald-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>A full calendar.<br /><span className="text-emerald-400">Zero back-and-forth.</span></>}
          sub="Automax scheduling works in the background so you can focus on the work, not the logistics."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
