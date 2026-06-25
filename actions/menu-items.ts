'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { menuItemSchema } from '@/lib/validations/menu-item'

async function getVenueSlugFromCategory(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categoryId: string
) {
  const { data } = await supabase
    .from('categories')
    .select('venue_id, venues(slug)')
    .eq('id', categoryId)
    .single()
  const venues = data?.venues as { slug: string } | null
  return { venueId: data?.venue_id, slug: venues?.slug ?? null }
}

export async function createMenuItem(formData: unknown) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const parsed = menuItemSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { venueId, slug } = await getVenueSlugFromCategory(supabase, parsed.data.category_id)

  const { data, error } = await supabase
    .from('menu_items')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return { error: error.message }

  if (slug) revalidatePath(`/p/${slug}`)
  if (venueId) revalidatePath(`/venues/${venueId}/menu`)

  return { data }
}

export async function updateMenuItem(id: string, formData: unknown) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const parsed = menuItemSchema.partial().safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { data, error } = await supabase
    .from('menu_items')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  const { venueId, slug } = await getVenueSlugFromCategory(supabase, data.category_id)
  if (slug) revalidatePath(`/p/${slug}`)
  if (venueId) revalidatePath(`/venues/${venueId}/menu`)

  return { data }
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const { data: item } = await supabase.from('menu_items').select('category_id').eq('id', id).single()

  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) return { error: error.message }

  if (item) {
    const { venueId, slug } = await getVenueSlugFromCategory(supabase, item.category_id)
    if (slug) revalidatePath(`/p/${slug}`)
    if (venueId) revalidatePath(`/venues/${venueId}/menu`)
  }

  return { data: true }
}

export async function reorderMenuItems(categoryId: string, orderedIds: string[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const updates = orderedIds.map((id, index) =>
    supabase.from('menu_items').update({ position: index }).eq('id', id)
  )
  await Promise.all(updates)

  const { venueId, slug } = await getVenueSlugFromCategory(supabase, categoryId)
  if (slug) revalidatePath(`/p/${slug}`)
  if (venueId) revalidatePath(`/venues/${venueId}/menu`)

  return { data: true }
}
