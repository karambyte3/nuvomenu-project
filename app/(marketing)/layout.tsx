import Link from 'next/link'
import Logo from '@/components/shared/Logo'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(241,239,232,0.9)', borderColor: 'rgba(159,225,203,0.3)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              href="/pricing"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--stone)' }}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--stone)' }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--teal-primary)' }}
            >
              Get started free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Dark minimal footer */}
      <footer style={{ backgroundColor: '#1A1A18' }} className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <Logo size="sm" light />
              <p className="mt-3 text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                The modern way to manage and share your restaurant menu.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
              <a href="mailto:hello@nuvomenu.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>
            <p>&copy; {new Date().getFullYear()} Nuvomenu. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
