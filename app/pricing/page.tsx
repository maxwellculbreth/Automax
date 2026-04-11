'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Zap, BrainCircuit } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { cn } from '@/lib/utils'

// ── Plan definitions ──────────────────────────────────────────────────────────

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    tagline: 'Get organized, quote faster, and start winning jobs.',
    monthlyPrice: 49,
    annualMonthly: 39,
    annualTotal: 468,
    highlight: false,
    badge: null as string | null,
    badgeVariant: null as 'blue' | 'amber' | null,
    cta: 'Start Free Trial',
    features: [
      'Lead Inbox',
      'Pipeline & Jobs',
      'Unlimited Quotes',
      'Clients CRM',
      'Finance basics',
      'Review request automation',
      'Basic follow-up reminders',
      'Basic reporting',
      '1 user seat',
      'Email support',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    tagline: 'Automate your growth. Close more without working more.',
    monthlyPrice: 99,
    annualMonthly: 79,
    annualTotal: 948,
    highlight: true,
    badge: 'Most Popular' as string | null,
    badgeVariant: 'blue' as 'blue' | 'amber' | null,
    cta: 'Start Free Trial',
    features: [
      'Everything in Starter',
      'AI reply suggestions',
      'Advanced follow-up automation',
      'Missed-call text back',
      'Industry quote templates',
      'Branded workflow automations',
      'Advanced reporting',
      'Up to 5 user seats',
      'Priority email & chat support',
    ],
  },
  {
    key: 'max',
    name: 'Max',
    tagline: 'Scale with AI. The full operating system for serious operators.',
    monthlyPrice: 299,
    annualMonthly: 229,
    annualTotal: 2748,
    highlight: false,
    badge: 'Full AI' as string | null,
    badgeVariant: 'amber' as 'blue' | 'amber' | null,
    cta: 'Book a Demo',
    features: [
      'Everything in Pro',
      'AutoMe AI agent',
      'Industry-aware quoting logic',
      'Advanced automation rules',
      'Higher usage limits',
      'Deeper analytics & projections',
      'Premium onboarding session',
      'Early access to new features',
      'Unlimited user seats',
      'Priority phone & chat support',
    ],
  },
]

const FAQ = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — all plans include a 14-day free trial with no credit card required. You get full access to every feature on your plan before committing.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Absolutely. You can upgrade or downgrade at any time from your account settings. Changes take effect immediately and are prorated.',
  },
  {
    q: 'What counts as a user seat?',
    a: 'A user is any team member with a login to your Automax account. Starter supports 1 user, Pro supports up to 5, and Max includes unlimited seats.',
  },
  {
    q: 'What is AutoMe?',
    a: 'AutoMe is Automax\'s flagship AI agent — it learns your pricing, your voice, and how you run your business, then handles lead qualification, quote drafting, and follow-ups in a way that sounds like you. It\'s included on the Max plan.',
  },
  {
    q: 'How does annual billing work?',
    a: 'When you choose annual billing, you\'re charged once per year at the annual rate. Starter is $468/yr, Pro is $948/yr, and Max is $2,748/yr. You can switch to annual at any time from your account settings.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Automax is built on enterprise-grade infrastructure with row-level security, encrypted data at rest and in transit, and strict access controls. We never sell your data.',
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <MarketingShell>
      <div className="bg-[#080f1e]">
        <MarketingNav />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16 pb-24">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-600/12 blur-[130px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="relative mx-auto max-w-3xl px-5 sm:px-6 text-center pt-16 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5 mb-5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="text-[12px] font-semibold text-blue-300 tracking-wide">Simple, Transparent Pricing</span>
            </div>
            <h1 className="text-[40px] sm:text-[52px] font-bold text-white tracking-tight leading-[1.08] mb-4">
              Pick the plan that<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                fits your operation.
              </span>
            </h1>
            <p className="text-[17px] text-white/50 max-w-md mx-auto leading-relaxed mb-9">
              All plans include a 14-day free trial. No credit card required to start.
            </p>

            {/* ── Billing toggle ───────────────────────────────────────────── */}
            <div className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  'rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all duration-150',
                  !annual
                    ? 'bg-white text-[#080f1e] shadow-[0_1px_4px_rgba(0,0,0,0.35)]'
                    : 'text-white/55 hover:text-white/80',
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  'rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all duration-150 flex items-center gap-2.5',
                  annual
                    ? 'bg-white text-[#080f1e] shadow-[0_1px_4px_rgba(0,0,0,0.35)]'
                    : 'text-white/55 hover:text-white/80',
                )}
              >
                Annual
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  ~Save 25%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Plan cards ───────────────────────────────────────────────────── */}
        <section className="pb-24 sm:pb-32 -mt-10">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-5 items-stretch">
              {PLANS.map(plan => {
                const price = annual ? plan.annualMonthly : plan.monthlyPrice
                const monthlySavings = plan.monthlyPrice - plan.annualMonthly

                return (
                  <div
                    key={plan.key}
                    className={cn(
                      'relative flex flex-col rounded-3xl border transition-all duration-200',
                      plan.highlight
                        ? 'border-blue-500/45 bg-gradient-to-b from-[#0e2050] to-[#0b1840] shadow-[0_0_0_1px_rgba(59,130,246,0.18),0_28px_90px_-10px_rgba(59,130,246,0.3)]'
                        : plan.badgeVariant === 'amber'
                        ? 'border-amber-500/20 bg-white/[0.03] hover:border-amber-500/30 hover:bg-white/[0.045]'
                        : 'border-white/8 bg-white/[0.025] hover:border-white/14 hover:bg-white/[0.04]',
                    )}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        {plan.badgeVariant === 'blue' && (
                          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(59,130,246,0.45)]">
                            <Zap className="h-3 w-3" />
                            {plan.badge}
                          </div>
                        )}
                        {plan.badgeVariant === 'amber' && (
                          <div className="relative flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-950 shadow-[0_4px_16px_rgba(245,158,11,0.5)]">
                            <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                            <BrainCircuit className="relative h-3 w-3" />
                            <span className="relative">{plan.badge}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-7 flex flex-col flex-1">
                      {/* Plan header */}
                      <div className="mb-6">
                        <h2 className="text-[19px] font-bold text-white mb-1.5">{plan.name}</h2>
                        <p className="text-[13px] text-white/50 leading-snug">{plan.tagline}</p>
                      </div>

                      {/* Price */}
                      <div className="mb-1">
                        <div className="flex items-end gap-1">
                          <span className="text-[50px] font-bold tracking-tight leading-none text-white">
                            ${price}
                          </span>
                          <span className="text-[14px] text-white/40 mb-2.5">/mo</span>
                        </div>
                        {annual ? (
                          <div className="mt-2 text-[12px] text-white/40">
                            ${plan.annualTotal.toLocaleString()}/year · billed annually
                          </div>
                        ) : (
                          <div className="mt-2 text-[12px] text-emerald-400/70">
                            Save ${monthlySavings}/mo with annual billing
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-6 mb-7">
                        {plan.highlight ? (
                          <Link
                            href="/auth/sign-up"
                            className="relative flex items-center justify-center gap-2 w-full overflow-hidden rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-5 py-3 text-[14px] font-bold text-white shadow-[0_2px_16px_rgba(59,130,246,0.5)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_24px_rgba(59,130,246,0.6)] hover:-translate-y-px active:translate-y-0 transition-all duration-150 group"
                          >
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                            <span className="relative">{plan.cta}</span>
                            <ArrowRight className="relative h-4 w-4" />
                          </Link>
                        ) : plan.badgeVariant === 'amber' ? (
                          <Link
                            href="/resources/book-a-demo"
                            className="relative flex items-center justify-center gap-2 w-full overflow-hidden rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 px-5 py-3 text-[14px] font-bold text-[#1a0f00] shadow-[0_2px_16px_rgba(245,158,11,0.35)] hover:from-amber-300 hover:to-amber-400 hover:shadow-[0_4px_24px_rgba(245,158,11,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-150 group"
                          >
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <span className="relative">{plan.cta}</span>
                            <ArrowRight className="relative h-4 w-4" />
                          </Link>
                        ) : (
                          <Link
                            href="/auth/sign-up"
                            className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-[14px] font-semibold text-white/80 hover:border-white/20 hover:bg-white/8 hover:text-white transition-all duration-150"
                          >
                            {plan.cta} <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>

                      {/* Divider */}
                      <div className={cn('border-t mb-6', plan.highlight ? 'border-white/10' : 'border-white/6')} />

                      {/* Features */}
                      <ul className="space-y-3 flex-1">
                        {plan.features.map(feature => (
                          <li key={feature} className="flex items-start gap-3">
                            <span className={cn(
                              'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ring-1',
                              plan.highlight
                                ? 'bg-blue-500/20 ring-blue-400/35'
                                : 'bg-blue-500/15 ring-blue-500/20',
                            )}>
                              <Check className={cn('h-2.5 w-2.5', plan.highlight ? 'text-blue-200' : 'text-blue-300')} />
                            </span>
                            <span className={cn(
                              'text-[13px] leading-snug',
                              plan.highlight ? 'text-white/85' : 'text-white/70',
                            )}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Guarantee note */}
            <p className="text-center text-[13px] text-white/35 mt-8">
              Starter &amp; Pro plans include a <strong className="text-white/55 font-semibold">14-day free trial</strong> — no credit card required. Cancel or change plans anytime.
            </p>
          </div>
        </section>

        {/* ── "Not sure?" section ───────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-6 text-center">
            <h2 className="text-[24px] sm:text-[30px] font-bold text-white tracking-tight mb-3">
              Not sure which plan is right?
            </h2>
            <p className="text-[15px] text-white/45 mb-7 max-w-md mx-auto">
              Start on Starter and upgrade when you&apos;re ready. Most growing businesses move to Pro within 60 days.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/resources/book-a-demo"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors"
              >
                Book a Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/resources/roi-calculator"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-5 py-2.5 text-[14px] font-medium text-white/65 hover:border-white/22 hover:text-white/85 transition-colors"
              >
                ROI Calculator
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {FAQ.map(item => (
                <div key={item.q} className="rounded-2xl border border-white/8 bg-white/[0.025] px-6 py-5">
                  <h3 className="text-[14px] font-bold text-white mb-2">{item.q}</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-white/8 py-20 sm:py-24">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px] rounded-full bg-blue-600/12 blur-[110px]" />
          <div className="relative mx-auto max-w-2xl px-5 sm:px-6 text-center">
            <h2 className="text-[30px] sm:text-[42px] font-bold text-white tracking-tight leading-tight mb-4">
              Start your free trial today.
            </h2>
            <p className="text-[16px] text-white/45 mb-8 max-w-sm mx-auto leading-relaxed">
              Join 500+ service businesses using Automax to win more jobs and grow their revenue.
            </p>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(59,130,246,0.45)] hover:from-blue-400 hover:to-blue-500 hover:-translate-y-px transition-all duration-150"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-[12px] text-white/25">No credit card required · 14-day trial · Cancel anytime</p>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
