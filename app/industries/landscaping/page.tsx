import Link from 'next/link'
import { ArrowRight, Check, Leaf, Calendar, Users, FileText, Repeat, TrendingUp, MapPin } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function LandscapingPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-emerald-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-green-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Industries · Landscaping</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Manage seasonal volume<br />
                <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  without the chaos.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Landscaping is feast-or-famine by nature. Automax helps you crush peak season and stay active in the slow months — with less time spent on admin and more on the work.
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
                {['Recurring job scheduling', 'Crew management built in', 'Seasonal re-engagement campaigns'].map(f => (
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
          { value: '3x',    label: 'More recurring clients retained' },
          { value: '6h+',   label: 'Admin time saved weekly' },
          { value: '28%',   label: 'Higher average job value' },
          { value: '100%',  label: 'Route optimized scheduling' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Built for landscapers</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Every season. Every crew.<br className="hidden sm:block" />
                Every client.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Landscaping businesses run on recurring clients and tight seasonal windows. Automax is designed to maximize both.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Repeat, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Recurring Job Automation',
                  desc: 'Set up weekly mowing, monthly mulching, or seasonal cleanups once. Automax schedules every future job automatically.',
                },
                {
                  icon: Users, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Crew Scheduling',
                  desc: 'Assign jobs to specific crew members or teams. Everyone sees their jobs for the day, with addresses and job notes.',
                },
                {
                  icon: MapPin, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Route Optimization',
                  desc: 'Group jobs by neighborhood to minimize drive time. Fit more work into each day without adding more hours.',
                },
                {
                  icon: Calendar, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Seasonal Campaigns',
                  desc: 'Spring cleanup, fall leaf removal, winter prep — Automax automatically reaches out to past clients before each season starts.',
                },
                {
                  icon: FileText, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Landscape-Specific Quotes',
                  desc: 'Templates for mowing, mulching, landscaping installs, irrigation, and more. Professional quotes sent in under 2 minutes.',
                },
                {
                  icon: TrendingUp, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Revenue by Service Type',
                  desc: 'See which services are most profitable per hour — mowing vs. installs vs. cleanup. Focus your crew where margins are highest.',
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
              <SectionLabel>How landscapers use it</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From estimate to repeat client.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Estimate Sent Fast', desc: 'Walk the property, open Automax, send a detailed quote in 2 minutes. Customers can approve from their phone.' },
                { num: '02', title: 'Job Scheduled', desc: 'Route-optimized time slot confirmed automatically. Crew gets their assignment with job notes and address.' },
                { num: '03', title: 'Recurring Jobs Set', desc: 'One-time or recurring — mark it in the job and future visits schedule themselves. Zero manual rescheduling.' },
                { num: '04', title: 'Season Starts Early', desc: 'Before spring, Automax contacts last year\'s clients. Your season books up before competitors start marketing.' },
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
          headline={<>This season.<br /><span className="text-emerald-400">Fully booked.</span></>}
          sub="Landscaping businesses on Automax retain more recurring clients and enter every season ahead of schedule."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
