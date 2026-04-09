'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_MENUS = {
  platform: {
    label: 'Platform',
    cols: 2,
    items: [
      { label: 'CRM Overview',       desc: 'Your full business operation in one place', href: '#' },
      { label: 'Lead Inbox',         desc: 'Capture and respond to every inbound lead',  href: '#' },
      { label: 'Pipeline & Jobs',    desc: 'Move jobs from quote to closed',             href: '#' },
      { label: 'Quotes & Payments',  desc: 'Send professional quotes in minutes',        href: '#' },
      { label: 'Clients',            desc: 'Manage relationships and history',           href: '#' },
      { label: 'Business Dashboard', desc: 'Revenue, jobs, and KPIs at a glance',        href: '#' },
    ],
  },
  growth: {
    label: 'Growth',
    cols: 2,
    items: [
      { label: 'Google Reviews Automation', desc: 'Request and manage reviews automatically', href: '#' },
      { label: 'Website Builder',           desc: 'Professional site built for you, free',    href: '#' },
      { label: 'Lead Capture',              desc: 'Convert website visitors into leads',      href: '#' },
      { label: 'Follow-Up Campaigns',       desc: 'Re-engage past customers automatically',   href: '#' },
      { label: 'Referral Growth',           desc: 'Turn happy clients into new business',     href: '#' },
      { label: 'Local Reputation Tools',    desc: 'Build trust in your service area',         href: '#' },
    ],
  },
  automation: {
    label: 'Automation',
    cols: 2,
    items: [
      { label: 'AI Assistant',           desc: 'AI that qualifies leads and drafts replies', href: '#' },
      { label: 'Smart Follow-Ups',       desc: 'Never let a lead go cold',                  href: '#' },
      { label: 'Automated Scheduling',   desc: 'Book jobs without the back-and-forth',      href: '#' },
      { label: 'Quote Reminders',        desc: 'Close more with timely nudges',              href: '#' },
      { label: 'Workflow Automation',    desc: 'Build custom trigger-action sequences',      href: '#' },
      { label: 'Revenue Insights',       desc: 'Forecast and track growth over time',        href: '#' },
    ],
  },
  industries: {
    label: 'Industries',
    cols: 2,
    items: [
      { label: 'Pressure Washing', desc: '', href: '#' },
      { label: 'Landscaping',      desc: '', href: '#' },
      { label: 'Cleaning',         desc: '', href: '#' },
      { label: 'Mobile Detailing', desc: '', href: '#' },
      { label: 'Contracting',      desc: '', href: '#' },
      { label: 'Home Services',    desc: '', href: '#' },
    ],
  },
  resources: {
    label: 'Resources',
    cols: 1,
    items: [
      { label: 'Case Studies',    desc: 'See how contractors grow with Automax', href: '#' },
      { label: 'Book a Demo',     desc: 'See the platform live with your team',  href: '#' },
      { label: 'Blog',            desc: 'Tips and strategy for service pros',    href: '#' },
      { label: 'Help Center',     desc: 'Guides, docs, and support',             href: '#' },
      { label: 'ROI Calculator',  desc: 'Estimate your growth potential',        href: '#' },
    ],
  },
} as const

type MenuKey = keyof typeof NAV_MENUS

export function MarketingNav() {
  const [activeMenu, setActiveMenu]   = useState<MenuKey | null>(null)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function openMenu(key: MenuKey) {
    if (timerRef.current) clearTimeout(timerRef.current)
    setActiveMenu(key)
  }

  function scheduleClose() {
    timerRef.current = setTimeout(() => setActiveMenu(null), 120)
  }

  function cancelClose() {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const menu = activeMenu ? NAV_MENUS[activeMenu] : null

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-[#080f1e]/95 backdrop-blur-md border-b border-white/8 shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div ref={navRef} className="flex items-center h-16 gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-500 to-indigo-700 shadow-[0_2px_10px_rgba(59,130,246,0.35)]">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] tracking-tight select-none">
              <span className="font-bold text-white">Auto</span>
              <span className="font-light text-blue-400/80">max</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {(Object.keys(NAV_MENUS) as MenuKey[]).map(key => (
              <button
                key={key}
                onMouseEnter={() => openMenu(key)}
                onMouseLeave={scheduleClose}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors',
                  activeMenu === key ? 'text-white' : 'text-white/60 hover:text-white',
                )}
              >
                {NAV_MENUS[key].label}
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-150', activeMenu === key && 'rotate-180')} />
              </button>
            ))}
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-md text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <Link href="/auth/login" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors px-3 py-2">
              Log In
            </Link>
            <Link
              href="/auth/sign-up"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_2px_10px_rgba(59,130,246,0.35)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_18px_rgba(59,130,246,0.45)] transition-all duration-150"
            >
              Start Free Trial
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-auto p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mega-menu dropdown */}
      {activeMenu && menu && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="hidden lg:block absolute top-full inset-x-0 border-t border-white/8 bg-[#080f1e]/98 backdrop-blur-md shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
        >
          <div className="mx-auto max-w-7xl px-8 py-6">
            <div className={cn(
              'grid gap-2',
              menu.cols === 2 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 max-w-md',
            )}>
              {menu.items.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-3 rounded-xl p-3.5 hover:bg-white/5 transition-colors group"
                >
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/15 ring-1 ring-blue-500/20 group-hover:bg-blue-600/25 transition-colors">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white group-hover:text-blue-300 transition-colors">{item.label}</div>
                    {item.desc && <div className="text-[12px] text-white/40 mt-0.5 leading-relaxed">{item.desc}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#080f1e] border-t border-white/8">
          <div className="px-5 py-4 space-y-1">
            {(Object.keys(NAV_MENUS) as MenuKey[]).map(key => (
              <div key={key}>
                <div className="px-3 py-2 text-[13px] font-semibold text-white/40 uppercase tracking-wider">
                  {NAV_MENUS[key].label}
                </div>
                {NAV_MENUS[key].items.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-[14px] font-medium text-white/70 hover:text-white">Pricing</Link>
          </div>
          <div className="px-5 pb-5 pt-3 border-t border-white/8 flex flex-col gap-2.5">
            <Link href="/auth/login" className="flex items-center justify-center rounded-lg border border-white/15 px-4 py-2.5 text-[14px] font-medium text-white/70 hover:text-white">
              Log In
            </Link>
            <Link href="/auth/sign-up" className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2.5 text-[14px] font-semibold text-white">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
