import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080f1e] py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Logo */}
          <Link href="/early-access" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-gradient-to-br from-blue-500 to-indigo-700">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[14px] tracking-tight select-none">
              <span className="font-bold text-white">Auto</span>
              <span className="font-light text-blue-400/70">max</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-5">
            <Link href="/early-access" className="text-[12px] text-white/30 hover:text-white/65 transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-[12px] text-white/30 hover:text-white/65 transition-colors">
              What&apos;s Coming
            </Link>
            <Link href="/waitlist" className="text-[12px] text-white/30 hover:text-white/65 transition-colors">
              Join Waitlist
            </Link>
            <Link href="/legal/privacy" className="text-[12px] text-white/30 hover:text-white/65 transition-colors">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-[12px] text-white/30 hover:text-white/65 transition-colors">
              Terms
            </Link>
          </nav>

          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} Automax. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
