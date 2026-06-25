import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Pricing' }

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '30 days',
    desc: 'Try everything, no card needed.',
    features: ['1 venue', 'Unlimited menu items', 'QR code download', 'Guest menu page', 'Email support'],
    cta: 'Start free trial',
    href: '/signup',
    featured: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    desc: 'For established restaurants.',
    features: ['1 venue', 'Unlimited menu items', '3 staff seats', 'Multi-language (7 locales)', 'Priority support', 'Custom branding'],
    cta: 'Get Pro',
    href: '/signup',
    featured: true,
    badge: 'Most popular',
  },
  {
    name: 'Chain',
    price: '$49',
    period: '/month',
    desc: 'For groups and franchises.',
    features: ['Unlimited venues', 'Unlimited staff seats', 'Multi-language (7 locales)', 'Priority support', 'Custom branding', 'Dedicated onboarding'],
    cta: 'Get Chain',
    href: '/signup',
    featured: false,
    badge: null,
  },
]

const faqs = [
  { q: 'Do I need a credit card for the free trial?', a: 'No. The 30-day trial is completely free — no payment details required.' },
  { q: 'Can I change plans later?', a: 'Yes. Upgrade or downgrade anytime from your account settings. Changes take effect at the next billing cycle.' },
  { q: 'What happens when my trial ends?', a: 'You\'ll be prompted to choose a paid plan. Your menu stays live for 7 days so you have time to decide.' },
  { q: 'How does the QR code work?', a: 'Each venue gets a permanent URL and QR code. You download it once and it always points to your live menu — even after updates.' },
]

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: 'var(--mist)' }}>
        <p className="text-sm font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: 'var(--teal-primary)' }}>
          Pricing
        </p>
        <h1
          className="text-5xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-fraunces)', color: 'var(--ink)' }}
        >
          Simple, honest pricing
        </h1>
        <p className="text-lg max-w-md mx-auto" style={{ color: 'var(--stone)' }}>
          Start free for 30 days. Upgrade when you&apos;re ready. No hidden fees.
        </p>
      </section>

      {/* Plans */}
      <section className="py-16 px-6" style={{ backgroundColor: 'var(--teal-deep)' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-8 flex flex-col relative"
              style={{
                backgroundColor: plan.featured ? 'white' : 'rgba(255,255,255,0.08)',
                border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {plan.badge && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: 'var(--amber-accent)', color: 'white' }}
                >
                  {plan.badge}
                </span>
              )}
              <h2 className="font-bold text-lg mb-1" style={{ color: plan.featured ? 'var(--ink)' : 'white' }}>
                {plan.name}
              </h2>
              <p className="text-sm mb-5" style={{ color: plan.featured ? 'var(--stone)' : 'rgba(255,255,255,0.55)' }}>
                {plan.desc}
              </p>
              <div className="mb-6">
                <span
                  className="text-4xl font-bold"
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    color: plan.featured ? 'var(--teal-deep)' : 'white',
                  }}
                >
                  {plan.price}
                </span>
                <span className="text-sm ml-1" style={{ color: plan.featured ? 'var(--stone)' : 'rgba(255,255,255,0.55)' }}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span style={{ color: plan.featured ? 'var(--teal-primary)' : 'var(--teal-soft)' }}>✓</span>
                    <span style={{ color: plan.featured ? 'var(--stone)' : 'rgba(255,255,255,0.75)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: plan.featured ? 'var(--teal-primary)' : 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: 'var(--font-fraunces)', color: 'var(--ink)' }}
          >
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b pb-8" style={{ borderColor: 'var(--teal-tint)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--stone)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center relative overflow-hidden" style={{ backgroundColor: 'var(--teal-deep)' }}>
        <div
          className="absolute -top-16 -right-16 rounded-full opacity-10"
          style={{ width: 300, height: 300, backgroundColor: 'var(--teal-soft)' }}
        />
        <div className="relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-5"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Start your free trial today
          </h2>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--teal-soft)', color: 'var(--teal-deep)' }}
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>
    </>
  )
}
