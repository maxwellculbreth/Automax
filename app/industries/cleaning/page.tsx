import Link from 'next/link'
import { ArrowRight, Check, Sparkles, Repeat, Users, Star, DollarSign, MessageSquare, Calendar } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function CleaningPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-purple-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-pink-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Industries · Cleaning</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Built for cleaning businesses<br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  that run on repeat clients.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Residential and commercial cleaning lives on recurring revenue. Automax helps you lock in long-term clients, reduce cancellations, and grow referrals on autopilot.
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
                {['Recurring booking automation', 'Client history and notes', 'Automatic review requests'].map(f => (
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
          { value: '92%',  label: 'Recurring client retention rate' },
          { value: '2.1x', label: 'More referrals with review requests' },
          { value: '0',    label: 'Manual rescheduling needed' },
          { value: '4.9★', label: 'Average review score' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Built for cleaners</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Recurring revenue.<br className="hidden sm:block" />
                Recurring results.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                The best cleaning businesses grow through referrals and loyal clients. Automax is built to maximize both.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Repeat, color: 'bg-purple-500/15 text-purple-400',
                  title: 'Recurring Schedule Automation',
                  desc: 'Set a cleaning frequency once. Automax schedules every future visit, sends reminders, and handles rescheduling if needed.',
                },
                {
                  icon: Users, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Detailed Client Profiles',
                  desc: 'Every client has a full record — property notes, key entry instructions, preferred products, job history, and payment info.',
                },
                {
                  icon: MessageSquare, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'AI Lead Response',
                  desc: 'New inquiries get an instant, personalized reply that collects property details and books a quote — even on evenings and weekends.',
                },
                {
                  icon: Star, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Automatic Review Requests',
                  desc: 'After every cleaning, Automax sends a review request via text. Happy clients leave reviews. Unhappy clients get a private message first.',
                },
                {
                  icon: DollarSign, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Recurring Invoicing',
                  desc: 'Send invoices automatically on your recurring schedule. Accept card, ACH, or digital payment. No more chasing down checks.',
                },
                {
                  icon: Calendar, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Cancellation Recovery',
                  desc: 'When a client cancels, Automax triggers a re-engagement sequence — not to beg, but to stay top of mind for when they\'re ready again.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-purple-500/25 hover:bg-purple-500/[0.04] transition-all duration-200">
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
              <SectionLabel>How cleaners use it</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From new client to loyal regular.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Inquiry to Quote', desc: 'AI responds to new leads instantly, collects property details, and sends a quote for the first clean.' },
                { num: '02', title: 'First Clean Booked', desc: 'Customer approves the quote. Automax schedules and sends confirmation with all job details.' },
                { num: '03', title: 'Recurring Starts', desc: 'After the first visit, recurring schedule is locked in. Future cleans book themselves with zero effort.' },
                { num: '04', title: 'Review and Refer', desc: 'Post-clean review request fires automatically. Happy clients become your best marketing.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-purple-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>More repeat clients.<br /><span className="text-purple-400">More recurring revenue.</span></>}
          sub="Cleaning businesses on Automax keep more clients longer and spend less time managing their schedule."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
