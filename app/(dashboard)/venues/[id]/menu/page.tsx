import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MenuBuilder } from '@/components/menu/MenuBuilder'

export const metadata: Metadata = { title: 'Menu builder' }

export default async function MenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: venue } = await supabase
    .from('venues')
    .select('id, name, slug')
    .eq('id', id)
    .eq('owner_id', user!.id)
    .single()

  if (!venue) notFound()

  const { data: categories } = await supabase
    .from('categories')
    .select('*, menu_items(*)')
    .eq('venue_id', id)
    .order('position')

  const orderedCategories = (categories ?? []).map((cat) => ({
    ...cat,
    menu_items: [...(cat.menu_items ?? [])].sort((a, b) => a.position - b.position),
  }))

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
        <div>
          <Link href={`/venues/${id}`} className="text-sm mb-1 block hover:underline" style={{ color: 'var(--stone)' }}>
            ← {venue.name}
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>Menu builder</h1>
        </div>
        <a
          href={`/p/${venue.slug}`}
          target="_blank"
          className="text-sm px-4 py-2 rounded-lg border"
          style={{ borderColor: 'var(--teal-soft)', color: 'var(--teal-deep)' }}
        >
          Preview menu ↗
        </a>
      </div>
      <MenuBuilder venueId={id} venueSlug={venue.slug} initialCategories={orderedCategories} />
    </div>
  )
}
