import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Venues' }

export default async function VenuesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>Your venues</h1>
        <Link
          href="/new-venue"
          className="px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: 'var(--teal-primary)' }}
        >
          + New venue
        </Link>
      </div>

      {venues && venues.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {venues.map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="bg-white rounded-2xl p-6 border hover:shadow-md transition-shadow"
              style={{ borderColor: 'var(--teal-soft)' }}
            >
              <h2 className="font-semibold text-lg mb-1" style={{ color: 'var(--ink)' }}>{venue.name}</h2>
              {venue.address && (
                <p className="text-sm mb-3" style={{ color: 'var(--stone)' }}>{venue.address}</p>
              )}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: venue.active ? 'var(--teal-tint)' : '#f3f4f6',
                    color: venue.active ? 'var(--teal-deep)' : 'var(--stone)',
                  }}
                >
                  {venue.active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs" style={{ color: 'var(--stone)' }}>
                  /p/{venue.slug}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: 'var(--teal-soft)' }}>
          <div className="text-5xl mb-4">🍽️</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>No venues yet</h2>
          <p className="mb-6 text-sm" style={{ color: 'var(--stone)' }}>
            Create your first venue to get started
          </p>
          <Link
            href="/new-venue"
            className="px-6 py-2.5 rounded-lg text-white font-medium text-sm"
            style={{ backgroundColor: 'var(--teal-primary)' }}
          >
            Create venue
          </Link>
        </div>
      )}
    </div>
  )
}
