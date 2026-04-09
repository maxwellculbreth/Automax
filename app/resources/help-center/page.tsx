import Link from 'next/link'
import { ArrowRight, Check, HelpCircle, BookOpen, MessageSquare, Zap, Users, FileText, Search } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, StatStrip } from '@/components/marketing/platform-shared'

const CATEGORIES = [
  {
    icon: Zap,
    title: 'Getting Started',
    desc: 'Account setup, connecting your number, importing leads, and your first workflow.',
    articles: ['Create your account', 'Set up your business profile', 'Connect your phone number', 'Import existing clients', 'Send your first quote'],
    color: 'bg-blue-500/15 text-blue-400',
  },
  {
    icon: MessageSquare,
    title: 'AI & Automation',
    desc: 'How the AI assistant works, setting up follow-up sequences, and building workflows.',
    articles: ['How AI response works', 'Customizing your AI tone', 'Setting confidence thresholds', 'Building follow-up sequences', 'Workflow automation basics'],
    color: 'bg-violet-500/15 text-violet-400',
  },
  {
    icon: FileText,
    title: 'Quotes & Payments',
    desc: 'Creating quotes, collecting payments, invoicing, and financial tracking.',
    articles: ['Creating your first quote', 'Quote templates by service type', 'Collecting payment via link', 'Setting up recurring invoices', 'Understanding your revenue dashboard'],
    color: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    icon: Users,
    title: 'CRM & Clients',
    desc: 'Managing leads, client profiles, pipeline stages, and job history.',
    articles: ['Understanding the pipeline', 'Adding and managing leads', 'Client profile overview', 'Job history and notes', 'Marking jobs complete'],
    color: 'bg-amber-500/15 text-amber-400',
  },
  {
    icon: BookOpen,
    title: 'Reviews & Reputation',
    desc: 'Automating review requests, managing responses, and building your reputation.',
    articles: ['Setting up review automation', 'Google review integration', 'Handling negative feedback', 'Review timing best practices', 'Reputation dashboard'],
    color: 'bg-pink-500/15 text-pink-400',
  },
  {
    icon: HelpCircle,
    title: 'Billing & Account',
    desc: 'Plans, billing, team members, account settings, and data export.',
    articles: ['Changing your plan', 'Managing team members', 'Data export and backup', 'Cancellation and refunds', 'API and integrations'],
    color: 'bg-teal-500/15 text-teal-400',
  },
]

export default function HelpCenterPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-24">
            <div className="text-center max-w-[640px] mx-auto">
              <div className="mb-5">
                <SectionLabel>Resources · Help Center</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Everything you need<br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  to get up and running.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed mb-8">
                Guides, walkthroughs, and answers for every part of Automax — from setup to advanced automation.
              </p>

              {/* Search bar (visual) */}
              <div className="relative max-w-[480px] mx-auto mb-8">
                <div className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 hover:border-white/20 transition-colors">
                  <Search className="h-4 w-4 text-white/30 flex-shrink-0" />
                  <span className="text-[14px] text-white/30">Search help articles…</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {['200+ articles', 'Video walkthroughs', 'Live chat support'].map(f => (
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
          { value: '200+',  label: 'Help articles' },
          { value: '< 2m',  label: 'Average response time' },
          { value: '98%',   label: 'Issues resolved first contact' },
          { value: '4.9★',  label: 'Support satisfaction' },
        ]} />

        {/* Help categories */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Help categories</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Find what you're looking for.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon
                return (
                  <div key={cat.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-blue-500/25 hover:bg-blue-500/[0.03] transition-all duration-200">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.color} mb-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-white mb-1.5">{cat.title}</h3>
                    <p className="text-[13px] text-white/40 leading-relaxed mb-4">{cat.desc}</p>
                    <ul className="space-y-1.5">
                      {cat.articles.map(a => (
                        <li key={a} className="flex items-center gap-2 text-[12.5px] text-white/50 hover:text-white/75 transition-colors cursor-pointer">
                          <div className="h-1 w-1 rounded-full bg-white/25 flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact support */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionLabel>Still need help?</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                Our team is here for you.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-md mx-auto">
                Can't find what you need? Reach out directly and we'll get back to you fast.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-5 max-w-[720px] mx-auto">
              {[
                { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with our support team in real time from inside the app.', cta: 'Open App' },
                { icon: FileText,      title: 'Email Support', desc: 'Send us a detailed question and we\'ll respond within a few hours.', cta: 'Send Email' },
                { icon: Users,         title: 'Book a Call', desc: 'Need a walkthrough? Schedule a 1-on-1 with the team.', cta: 'Schedule' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 mx-auto mb-3">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-[14px] font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-[12.5px] text-white/40 leading-snug mb-4">{item.desc}</p>
                    <Link href="/auth/sign-up" className="text-[12.5px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                      {item.cta} →
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
            <h2 className="text-[28px] sm:text-[36px] font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-[16px] text-white/45 max-w-md mx-auto mb-8">
              Try Automax free for 14 days. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/sign-up" className={BLUE_BTN}>
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/resources/book-a-demo" className={GHOST_BTN}>
                Book a Demo
              </Link>
            </div>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
