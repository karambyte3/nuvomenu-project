import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { updateVenue } from '@/actions/venues'
import { VenueSettingsForm } from './VenueSettingsForm'

export const metadata: Metadata = { title: 'Venue settings' }

export default async function VenueSettingsPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link href={`/venues/${id}`} className="text-sm mb-4 block hover:underline" style={{ color: 'var(--stone)' }}>
        ← Back to venue
      </Link>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--ink)' }}>Venue settings</h1>
      <VenueSettingsForm venue={venue} updateVenue={updateVenue} />
    </div>
  )
}
