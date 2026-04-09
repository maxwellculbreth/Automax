import Link from 'next/link'

const LINKS = {
  Product: [
    { label: 'CRM & Pipeline', href: '#' },
    { label: 'Quotes & Payments', href: '#' },
    { label: 'Clients', href: '#' },
    { label: 'AI Automation', href: '#' },
    { label: 'Google Reviews', href: '#' },
    { label: 'Website Builder', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Case Studies', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Book a Demo', href: '#' },
    { label: 'ROI Calculator', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

export function MarketingFooter() {
  return (
    <footer className="bg-[#080f1e] border-t border-white/8">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-500 to-indigo-700">
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
            <p className="text-[13px] text-white/40 leading-relaxed max-w-[220px]">
              AI-powered CRM and automation for modern service businesses.
            </p>
            <p className="mt-6 text-[12px] text-white/20">
              © {new Date().getFullYear()} Automax. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          <div className="col-span-2 lg:col-span-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {(Object.keys(LINKS) as Array<keyof typeof LINKS>).map(section => (
              <div key={section}>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">{section}</div>
                <ul className="space-y-2">
                  {LINKS[section].map(link => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-[13px] text-white/50 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
