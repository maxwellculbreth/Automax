import Link from 'next/link'
import { ArrowRight, Check, TrendingUp, Star, DollarSign, Users, BarChart2, Quote } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

const CASE_STUDIES = [
  {
    name: 'Marcus T.',
    company: 'Clean Slate Pressure Washing',
    location: 'Atlanta, GA',
    industry: 'Pressure Washing',
    quote: 'I went from missing half my leads to closing almost all of them. The AI response alone paid for Automax in the first week.',
    results: [
      { label: 'Revenue increase', value: '+$3,200/mo' },
      { label: 'Leads converted', value: '68% → 91%' },
      { label: 'Admin time saved', value: '8 hrs/week' },
    ],
    color: 'blue',
  },
  {
    name: 'Jordan M.',
    company: 'Emerald Lawn & Landscape',
    location: 'Nashville, TN',
    industry: 'Landscaping',
    quote: 'Recurring scheduling changed everything. I used to spend Sunday nights manually booking the whole week. Now it just happens.',
    results: [
      { label: 'Recurring clients', value: '+40%' },
      { label: 'Schedule time saved', value: '6 hrs/week' },
      { label: 'On-time rate', value: '99%' },
    ],
    color: 'emerald',
  },
  {
    name: 'Angela S.',
    company: 'Pristine Detail Co.',
    location: 'Dallas, TX',
    industry: 'Mobile Detailing',
    quote: 'The review automation alone is worth it. I went from 12 Google reviews to over 80 in three months without asking a single person myself.',
    results: [
      { label: 'Google reviews', value: '12 → 87' },
      { label: 'Average ticket', value: '+$65' },
      { label: 'Return bookings', value: '+55%' },
    ],
    color: 'amber',
  },
  {
    name: 'Chris R.',
    company: 'Brighter Spaces Cleaning',
    location: 'Phoenix, AZ',
    industry: 'Residential Cleaning',
    quote: 'Automax turned one-time cleans into recurring clients. My revenue is more predictable now than it\'s ever been.',
    results: [
      { label: 'Revenue predictability', value: '3x better' },
      { label: 'Cancellation rate', value: '18% → 6%' },
      { label: 'Referrals per month', value: '+8' },
    ],
    color: 'violet',
  },
]

const colorMap: Record<string, { border: string; badge: string; dot: string }> = {
  blue:    { border: 'border-blue-500/20 hover:border-blue-400/35',    badge: 'bg-blue-500/15 text-blue-300',    dot: 'bg-blue-400' },
  emerald: { border: 'border-emerald-500/20 hover:border-emerald-400/35', badge: 'bg-emerald-500/15 text-emerald-300', dot: 'bg-emerald-400' },
  amber:   { border: 'border-amber-500/20 hover:border-amber-400/35',  badge: 'bg-amber-500/15 text-amber-300',  dot: 'bg-amber-400' },
  violet:  { border: 'border-violet-500/20 hover:border-violet-400/35', badge: 'bg-violet-500/15 text-violet-300', dot: 'bg-violet-400' },
}

export default function CaseStudiesPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Resources · Case Studies</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Real results from real<br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  service businesses.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                These are contractors, cleaners, landscapers, and detailers who were managing everything manually — and changed everything with Automax.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/sign-up" className={BLUE_BTN}>
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/resources/book-a-demo" className={GHOST_BTN}>
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '500+', label: 'Businesses on Automax' },
          { value: '40%',  label: 'Average revenue lift' },
          { value: '6h+',  label: 'Admin time saved per week' },
          { value: '4.9★', label: 'Average review improvement' },
        ]} />

        {/* Case studies grid */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Customer stories</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                The results speak for themselves.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {CASE_STUDIES.map(cs => {
                const colors = colorMap[cs.color]
                return (
                  <div key={cs.name} className={`rounded-2xl border bg-white/[0.02] p-7 transition-all duration-200 ${colors.border}`}>
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="text-[15px] font-bold text-white">{cs.name}</div>
                        <div className="text-[13px] text-white/50 mt-0.5">{cs.company} · {cs.location}</div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
                        {cs.industry}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-6">
                      <Quote className="h-4 w-4 text-white/20 flex-shrink-0 mt-0.5" />
                      <p className="text-[14px] text-white/65 leading-relaxed italic">{cs.quote}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/8">
                      {cs.results.map(r => (
                        <div key={r.label}>
                          <div className="text-[16px] font-bold text-white">{r.value}</div>
                          <div className="text-[11px] text-white/35 mt-0.5 leading-snug">{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Common results section */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Common results</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                Patterns across every industry.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: TrendingUp, title: 'More Revenue', desc: 'Average 40% revenue lift in the first 90 days, driven by faster lead response and fewer missed opportunities.' },
                { icon: Star, title: 'Better Reviews', desc: 'Businesses go from a handful of reviews to 4.8+ stars with dozens of reviews in just a few months.' },
                { icon: DollarSign, title: 'Higher Tickets', desc: 'Automated upsells and add-on prompts push average job value up without any hard selling.' },
                { icon: Users, title: 'More Repeat Clients', desc: 'Recurring scheduling and re-engagement campaigns keep past clients booking again and again.' },
              ].map(r => {
                const Icon = r.icon
                return (
                  <div key={r.title} className="relative pl-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 mb-4">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-[15px] font-bold text-white mb-2">{r.title}</h3>
                    <p className="text-[13px] text-white/45 leading-relaxed">{r.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Your story<br /><span className="text-blue-400">starts here.</span></>}
          sub="Join 500+ service businesses already writing their own Automax success story."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
