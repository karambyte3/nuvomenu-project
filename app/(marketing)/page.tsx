import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Nuvomenu — Digital QR menus for restaurants' }

// ─── Phone mockup (guest menu preview) ───────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-center">
      {/* Floating stat card — top left */}
      <div
        className="absolute -left-4 top-8 z-10 rounded-xl px-4 py-3 shadow-xl"
        style={{ backgroundColor: 'white', minWidth: '160px' }}
      >
        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--stone)' }}>Today&apos;s scans</p>
        <p className="text-2xl font-bold" style={{ color: 'var(--teal-deep)', fontFamily: 'var(--font-fraunces)' }}>1,284</p>
        <p className="text-xs" style={{ color: 'var(--teal-primary)' }}>↑ 12% vs yesterday</p>
      </div>

      {/* Floating stat card — bottom right */}
      <div
        className="absolute -right-4 bottom-16 z-10 rounded-xl px-4 py-3 shadow-xl"
        style={{ backgroundColor: 'white', minWidth: '168px' }}
      >
        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--stone)' }}>Last updated</p>
        <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>2 minutes ago</p>
        <p className="text-xs" style={{ color: 'var(--teal-primary)' }}>● Live</p>
      </div>

      {/* Phone frame */}
      <div
        className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
        style={{
          width: '240px',
          height: '480px',
          border: '8px solid rgba(255,255,255,0.15)',
          backgroundColor: 'var(--mist)',
        }}
      >
        {/* Phone notch */}
        <div className="flex justify-center pt-3 pb-1" style={{ backgroundColor: '#F1EFE8' }}>
          <div className="rounded-full" style={{ width: 80, height: 6, backgroundColor: 'rgba(44,44,42,0.15)' }} />
        </div>

        {/* Menu header */}
        <div className="px-4 pt-3 pb-2" style={{ backgroundColor: '#F1EFE8' }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: 'var(--stone)' }}>Osteria Nuova</p>
          <p className="text-base font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-fraunces)' }}>Our Menu</p>
          {/* Category pills */}
          <div className="flex gap-2 mt-2 overflow-hidden">
            {['Starters', 'Mains', 'Drinks'].map((cat, i) => (
              <span
                key={cat}
                className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium"
                style={{
                  backgroundColor: i === 0 ? 'var(--teal-primary)' : 'rgba(159,225,203,0.3)',
                  color: i === 0 ? 'white' : 'var(--teal-deep)',
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="px-3 py-2 space-y-2" style={{ backgroundColor: '#F1EFE8' }}>
          {[
            { name: 'Burrata & Tomato', desc: 'Buffalo burrata, heirloom tomato', price: '€12', badge: 'New' },
            { name: 'Tagliatelle al Ragù', desc: 'Slow-cooked beef ragù', price: '€18', badge: null },
            { name: 'Branzino al Forno', desc: 'Roasted sea bass, herbs, lemon', price: '€24', badge: 'Featured' },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-xl p-3 flex items-start justify-between gap-2"
              style={{ backgroundColor: 'white' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>{item.name}</span>
                  {item.badge && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: item.badge === 'New' ? 'var(--teal-tint)' : 'rgba(239,159,39,0.15)',
                        color: item.badge === 'New' ? 'var(--teal-deep)' : 'var(--amber-accent)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] mt-0.5 leading-tight" style={{ color: 'var(--stone)' }}>{item.desc}</p>
              </div>
              <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--teal-deep)' }}>{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[600px]">
        {/* Left — copy on mist */}
        <div
          className="flex flex-col justify-center px-8 md:px-14 py-20 md:py-24"
          style={{ backgroundColor: 'var(--mist)' }}
        >
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
            style={{ color: 'var(--teal-primary)' }}
          >
            Digital menus for modern restaurants
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold leading-[1.05] mb-6"
            style={{ fontFamily: 'var(--font-fraunces)', color: 'var(--ink)' }}
          >
            Your menu,
            <br />
            <span style={{ color: 'var(--teal-deep)' }}>always</span>{' '}
            <em className="not-italic" style={{ fontStyle: 'italic' }}>perfect.</em>
          </h1>
          <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: 'var(--stone)' }}>
            Create a beautiful QR-code menu for your restaurant in minutes. Update it live — no reprinting, no delays, no apps for your guests to download.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="px-7 py-3.5 rounded-xl text-white font-semibold text-base shadow-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--teal-primary)' }}
            >
              Start free — 30 days
            </Link>
            <Link
              href="/pricing"
              className="px-7 py-3.5 rounded-xl font-semibold text-base border-2 transition-colors"
              style={{ color: 'var(--teal-deep)', borderColor: 'var(--teal-soft)' }}
            >
              See pricing
            </Link>
          </div>
          <p className="mt-5 text-sm" style={{ color: 'var(--stone)' }}>
            No credit card required &nbsp;·&nbsp; Cancel anytime
          </p>
        </div>

        {/* Right — phone on deep teal */}
        <div
          className="relative flex flex-col justify-center items-center px-8 py-20 overflow-hidden"
          style={{ backgroundColor: 'var(--teal-deep)' }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-24 -right-24 rounded-full opacity-10"
            style={{ width: 400, height: 400, backgroundColor: 'var(--teal-soft)' }}
          />
          <div
            className="absolute -bottom-16 -left-16 rounded-full opacity-10"
            style={{ width: 280, height: 280, backgroundColor: 'var(--teal-soft)' }}
          />
          <PhoneMockup />
        </div>
      </div>

      {/* Feature strip */}
      <div
        className="border-t border-b"
        style={{ backgroundColor: 'white', borderColor: 'rgba(159,225,203,0.4)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap justify-center md:justify-between gap-6">
          {[
            { icon: '⚡', text: 'Live updates in seconds' },
            { icon: '📱', text: 'No app download for guests' },
            { icon: '🌍', text: '7 languages supported' },
            { icon: '🎨', text: 'Fully branded experience' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: 'var(--ink)' }}>
              <span className="text-base">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Create your venue',
      desc: 'Sign up and add your restaurant. Give it a name, a slug, and upload your logo — takes under two minutes.',
    },
    {
      n: '2',
      title: 'Build your menu',
      desc: 'Add categories and dishes with photos, prices, and descriptions. Drag to reorder anytime. Toggle items unavailable without deleting them.',
    },
    {
      n: '3',
      title: 'Share your QR code',
      desc: 'Download your QR code as PNG or SVG. Print it, put it on the table, and guests see your live menu instantly — no app needed.',
    },
  ]

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--mist)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--teal-primary)' }}>
            Simple by design
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-fraunces)', color: 'var(--ink)' }}
          >
            Up and running in minutes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.n} className="relative">
              {/* Oversized numeral */}
              <div
                className="text-8xl font-bold leading-none mb-4 select-none"
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  color: 'var(--teal-soft)',
                }}
              >
                {step.n}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--ink)' }}>{step.title}</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--stone)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      title: 'Hide sold-out items instantly',
      desc: 'Toggle any item unavailable with one click. Guests see a clean menu — no awkward "sorry, we\'re out of that" conversations.',
      wide: true,
      accent: 'teal',
    },
    {
      title: 'Real-time updates',
      desc: 'Change a price, add a dish, swap a photo. Your QR menu updates live without reprinting a single page.',
      wide: false,
      accent: 'teal',
    },
    {
      title: 'Multi-language menus',
      desc: 'Offer your menu in up to 7 languages. Guests switch with one tap — no separate QR codes needed.',
      wide: false,
      accent: 'amber',
    },
    {
      title: 'Beautiful on every device',
      desc: 'Your menu is a fast, mobile-first web page. No app to download, no pinching to zoom.',
      wide: false,
      accent: 'teal',
    },
    {
      title: 'Team access with roles',
      desc: 'Invite staff as editors or viewers. They can update the menu — not your billing.',
      wide: false,
      accent: 'teal',
    },
    {
      title: 'QR code download',
      desc: 'Export as high-res PNG or scalable SVG. Drop it on a table tent, a poster, or your website.',
      wide: false,
      accent: 'teal',
    },
  ]

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'white' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--teal-primary)' }}>
            Everything you need
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-fraunces)', color: 'var(--ink)' }}
          >
            Built for busy restaurants
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`rounded-2xl p-7 ${i === 0 ? 'md:col-span-2' : ''}`}
              style={{ backgroundColor: 'var(--mist)' }}
            >
              <div
                className="w-8 h-8 rounded-lg mb-5 flex items-center justify-center"
                style={{
                  backgroundColor: f.accent === 'amber' ? 'rgba(239,159,39,0.15)' : 'var(--teal-tint)',
                }}
              >
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: f.accent === 'amber' ? 'var(--amber-accent)' : 'var(--teal-primary)',
                  }}
                />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ink)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--stone)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '30 days',
      desc: 'Try everything, no card needed.',
      features: ['1 venue', 'Unlimited menu items', 'QR code download', 'Guest menu page'],
      cta: 'Start free trial',
      href: '/signup',
      style: 'dark-glass',
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      desc: 'For established restaurants.',
      features: ['1 venue', 'Unlimited menu items', '3 staff seats', 'Multi-language (7 locales)', 'Priority support'],
      cta: 'Get Pro',
      href: '/signup',
      style: 'featured',
      badge: 'Most popular',
    },
    {
      name: 'Chain',
      price: '$49',
      period: '/month',
      desc: 'For groups and franchises.',
      features: ['Unlimited venues', 'Unlimited staff seats', 'Multi-language (7 locales)', 'Priority support', 'Custom branding'],
      cta: 'Get Chain',
      href: '/signup',
      style: 'dark-glass',
    },
  ]

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--teal-deep)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--teal-soft)' }}>
            Pricing
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => {
            const isFeatured = plan.style === 'featured'
            return (
              <div
                key={plan.name}
                className="rounded-2xl p-8 flex flex-col relative"
                style={{
                  backgroundColor: isFeatured ? 'white' : 'rgba(255,255,255,0.08)',
                  border: isFeatured ? 'none' : '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--amber-accent)', color: 'white' }}
                  >
                    {plan.badge}
                  </span>
                )}
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ color: isFeatured ? 'var(--ink)' : 'white' }}
                >
                  {plan.name}
                </h3>
                <p className="text-sm mb-5" style={{ color: isFeatured ? 'var(--stone)' : 'rgba(255,255,255,0.55)' }}>
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <span
                    className="text-4xl font-bold"
                    style={{
                      fontFamily: 'var(--font-fraunces)',
                      color: isFeatured ? 'var(--teal-deep)' : 'white',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm ml-1" style={{ color: isFeatured ? 'var(--stone)' : 'rgba(255,255,255,0.55)' }}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <span style={{ color: isFeatured ? 'var(--teal-primary)' : 'var(--teal-soft)' }}>✓</span>
                      <span style={{ color: isFeatured ? 'var(--stone)' : 'rgba(255,255,255,0.75)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: isFeatured ? 'var(--teal-primary)' : 'rgba(255,255,255,0.12)',
                    color: isFeatured ? 'white' : 'white',
                    border: isFeatured ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    {
      quote: 'We reprinted our menus three times last season. With Nuvomenu we haven\'t touched the printer once.',
      author: 'Marco B.',
      role: 'Owner, Osteria del Sole — Florence',
    },
    {
      quote: 'Our international guests love switching to their language. It feels like we\'ve added a full-time translator.',
      author: 'Aisha K.',
      role: 'Manager, Café Saffron — Dubai',
    },
    {
      quote: 'Setting up took 20 minutes. The QR code on our tables — guests scan it without even thinking.',
      author: 'Carlos M.',
      role: 'Chef-owner, La Plata — Buenos Aires',
    },
  ]

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--mist)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--teal-primary)' }}>
            Loved by restaurants
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-fraunces)', color: 'var(--ink)' }}
          >
            What our customers say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.author} className="rounded-2xl p-8 flex flex-col" style={{ backgroundColor: 'white' }}>
              <blockquote
                className="text-lg leading-relaxed mb-6 flex-1"
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                }}
              >
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{r.author}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--stone)' }}>{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: 'var(--teal-deep)' }}>
      {/* Decorative circles */}
      <div
        className="absolute -top-20 -right-20 rounded-full opacity-10"
        style={{ width: 360, height: 360, backgroundColor: 'var(--teal-soft)' }}
      />
      <div
        className="absolute -bottom-16 -left-16 rounded-full opacity-10"
        style={{ width: 240, height: 240, backgroundColor: 'var(--teal-soft)' }}
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-5"
          style={{ fontFamily: 'var(--font-fraunces)' }}
        >
          Ready to go paperless?
        </h2>
        <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Join hundreds of restaurants already using Nuvomenu. Start your free 30-day trial — no credit card required.
        </p>
        <Link
          href="/signup"
          className="inline-block px-10 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 shadow-lg"
          style={{ backgroundColor: 'var(--teal-soft)', color: 'var(--teal-deep)' }}
        >
          Start free trial
        </Link>
        <p className="mt-5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          30 days free &nbsp;·&nbsp; No card needed &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Testimonials />
      <FinalCTA />
    </>
  )
}
