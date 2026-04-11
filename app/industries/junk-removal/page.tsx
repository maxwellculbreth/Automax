import Link from 'next/link'
import { ArrowRight, Check, Trash2, MapPin, Clock, FileText, MessageSquare, Star, DollarSign } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function JunkRemovalPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-slate-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-zinc-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Industries · Junk Removal</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Junk removal wins on<br />
                <span className="bg-gradient-to-r from-slate-300 to-zinc-400 bg-clip-text text-transparent">
                  speed and availability.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Customers want it gone — today. Automax makes sure you're the first to respond, the fastest to quote, and the easiest to book. Fill your trucks without the back-and-forth.
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
                {['Same-day booking automation', 'Photo-based quote flow', 'Route-optimized scheduling'].map(f => (
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
          { value: '< 60s', label: 'Response time to new leads' },
          { value: '70%',   label: 'Of leads book on first contact' },
          { value: '2×',    label: 'More jobs per truck per day' },
          { value: '4.8★',  label: 'Average review rating' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Built for junk removal pros</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Quote it fast.<br className="hidden sm:block" />
                Book it faster.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Junk removal is a same-day business. The operator who responds first and quotes fastest wins. Automax is built for that speed.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: MessageSquare, color: 'bg-slate-500/20 text-slate-300',
                  title: 'Instant Lead Response',
                  desc: 'Every inbound lead — web form, text, or call — gets an AI reply in under 60 seconds. Ask about load size, location, and urgency before you lift a finger.',
                },
                {
                  icon: FileText, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Fast Quote Templates',
                  desc: 'Load-based quotes for full trucks, half loads, single items, and estate cleanouts. Send a professional estimate in 90 seconds. Customer approves by text.',
                },
                {
                  icon: Clock, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Same-Day Booking Flow',
                  desc: 'Leads that need it done today get routed to your nearest available time slot automatically. You approve it and it\'s confirmed — no back-and-forth.',
                },
                {
                  icon: MapPin, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Route Optimization',
                  desc: 'Stack your truck\'s day with nearby jobs. Less dead mileage between pickups means more loads per day and more revenue per truck.',
                },
                {
                  icon: DollarSign, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Upsell Add-On Services',
                  desc: 'After a standard pickup, Automax surfaces dumpster rental, recurring cleanout plans, and estate services. One job becomes a long-term relationship.',
                },
                {
                  icon: Star, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Post-Job Review Requests',
                  desc: 'When a job is marked complete, a review request fires automatically. Happy customers leave reviews. You grow your local reputation without asking.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-slate-500/25 hover:bg-slate-500/[0.04] transition-all duration-200">
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
              <SectionLabel>How junk pros use it</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                Lead in. Truck out. Review sent.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Lead Comes In', desc: 'AI responds instantly, asks about load size and timing, and offers same-day or next-day slots based on your availability.' },
                { num: '02', title: 'Quote Approved', desc: 'Customer gets a clean quote via text. One tap to approve. Deposit collected on the spot. Job added to your route.' },
                { num: '03', title: 'Job Completed', desc: 'Truck marks the job done. Payment collected on site or by link. Invoice sent automatically. Zero manual work.' },
                { num: '04', title: 'Review Requested', desc: 'Review request fires 2 hours after job completion. Fast, easy, automated. Your rating climbs without lifting a finger.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-slate-400/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>More loads per day.<br /><span className="text-slate-300">Less time on the phone.</span></>}
          sub="Junk removal operators on Automax respond faster, book more same-day jobs, and spend less time chasing quotes."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
