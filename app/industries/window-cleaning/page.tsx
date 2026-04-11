import Link from 'next/link'
import { ArrowRight, Check, Grid2x2, Repeat, FileText, MessageSquare, Star, Building2, MapPin } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function WindowCleaningPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-sky-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-blue-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Industries · Window Cleaning</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Window cleaning runs on<br />
                <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                  recurring relationships.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Residential and commercial window cleaning is built on repeat business. Automax helps you lock in recurring clients, route efficiently, and keep your schedule full without lifting a finger.
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
                {['Recurring schedule automation', 'Residential & commercial quote templates', 'Route-optimized scheduling'].map(f => (
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
          { value: '88%',  label: 'Recurring client retention rate' },
          { value: '4h+',  label: 'Admin time saved per week' },
          { value: '35%',  label: 'Higher avg ticket with add-ons' },
          { value: '4.9★', label: 'Average review rating' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Built for window cleaners</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Residential or commercial.<br className="hidden sm:block" />
                One or recurring.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Window cleaning businesses grow fastest when one-time cleans convert to recurring customers. Automax is built to make that happen automatically.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Repeat, color: 'bg-sky-500/15 text-sky-400',
                  title: 'Recurring Schedule Automation',
                  desc: 'Set a cleaning frequency — monthly, quarterly, bi-annual — and Automax handles every future booking, reminder, and confirmation automatically.',
                },
                {
                  icon: FileText, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Res & Commercial Quote Templates',
                  desc: 'Templates for interior/exterior residential, storefront, high-rise, and post-construction cleans. Professional quotes with pane counts sent in minutes.',
                },
                {
                  icon: MapPin, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Route Optimization',
                  desc: 'Group residential and commercial stops by zone to minimize drive time. Stack more jobs into each day without adding hours to your schedule.',
                },
                {
                  icon: Building2, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Commercial Account Management',
                  desc: 'Manage storefronts, office buildings, and property management contracts in one place. Track service history, frequency, and contact details per property.',
                },
                {
                  icon: MessageSquare, color: 'bg-teal-500/15 text-teal-400',
                  title: 'AI Lead Response',
                  desc: 'New inquiries get an instant reply that asks about property type, number of panes, and preferred schedule — so you quote faster and close more.',
                },
                {
                  icon: Star, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Post-Job Review Requests',
                  desc: 'After every clean, Automax sends a review request via text. Happy residential and commercial clients leave reviews — without you having to ask.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-sky-500/25 hover:bg-sky-500/[0.04] transition-all duration-200">
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
              <SectionLabel>How window cleaners use it</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From one-time to recurring client.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Inquiry to Quote', desc: 'AI responds instantly, collects property details and pane count, and sends a professional quote in under 2 minutes.' },
                { num: '02', title: 'First Clean Booked', desc: 'Customer approves and pays a deposit. Job is added to your route for the nearest available slot. Reminder fires automatically.' },
                { num: '03', title: 'Recurring Starts', desc: 'After the first clean, Automax offers a recurring schedule. Most customers convert to quarterly or bi-annual plans.' },
                { num: '04', title: 'Review and Refer', desc: 'Post-clean review request fires automatically. Happy clients leave reviews — and refer their neighbors.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-sky-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>More recurring clients.<br /><span className="text-sky-400">Less manual scheduling.</span></>}
          sub="Window cleaning businesses on Automax convert more one-time customers to recurring plans and spend less time managing their schedule."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
