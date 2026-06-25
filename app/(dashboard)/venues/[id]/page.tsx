import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Venue overview' }

export default async function VenueOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user!.id)
    .single()

  if (!venue) notFound()

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('venue_id', id)

  const { count: itemCount } = await supabase
    .from('menu_items')
    .select('id, categories!inner(venue_id)', { count: 'exact', head: true })
    .eq('categories.venue_id', id)

  const quickLinks = [
    { href: `/venues/${id}/menu`, label: 'Menu builder', icon: '📋', desc: 'Add categories and items' },
    { href: `/venues/${id}/qr`, label: 'QR code', icon: '📱', desc: 'Download your QR code' },
    { href: `/venues/${id}/settings`, label: 'Settings', icon: '⚙️', desc: 'Edit venue details' },
    { href: `/p/${venue.slug}`, label: 'Guest menu', icon: '🔗', desc: 'Preview public menu', external: true },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/venues" className="text-sm mb-2 block hover:underline" style={{ color: 'var(--stone)' }}>
            ← Venues
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{venue.name}</h1>
          {venue.address && <p className="text-sm mt-1" style={{ color: 'var(--stone)' }}>{venue.address}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 mb-8 gap-4">
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--teal-soft)' }}>
          <p className="text-3xl font-bold" style={{ color: 'var(--teal-deep)' }}>{categoryCount ?? 0}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--stone)' }}>Categories</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--teal-soft)' }}>
          <p className="text-3xl font-bold" style={{ color: 'var(--teal-deep)' }}>{itemCount ?? 0}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--stone)' }}>Menu items</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            className="bg-white rounded-2xl p-5 border hover:shadow-md transition-shadow flex items-center gap-4"
            style={{ borderColor: 'var(--teal-soft)' }}
          >
            <span className="text-2xl">{link.icon}</span>
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--ink)' }}>{link.label}</p>
              <p className="text-xs" style={{ color: 'var(--stone)' }}>{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
