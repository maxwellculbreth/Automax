'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-[#080f1e]/95 backdrop-blur-md border-b border-white/8 shadow-[0_1px_0_rgba(255,255,255,0.05)]'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between gap-4">

          {/* Logo */}
          <Link href="/early-access" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-500 to-indigo-700 shadow-[0_2px_10px_rgba(59,130,246,0.35)]">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] tracking-tight select-none">
              <span className="font-bold text-white">Auto</span>
              <span className="font-light text-blue-400/80">max</span>
            </span>
          </Link>

          {/* Center nav — desktop only */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <Link
              href="/features"
              className="px-3 py-2 rounded-md text-[13px] font-medium text-white/55 hover:text-white transition-colors"
            >
              What&apos;s Coming
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Badge — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/[0.08] px-3 py-1">
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
              </span>
              <span className="text-[11px] font-semibold text-amber-300 tracking-wide whitespace-nowrap">
                In Development
              </span>
            </div>

            {/* CTA */}
            <Link
              href="/waitlist"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_2px_10px_rgba(59,130,246,0.35)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_18px_rgba(59,130,246,0.45)] transition-all duration-150 flex-shrink-0"
            >
              Join Waitlist
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
    </header>
  )
}
