'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { categorySchema } from '@/lib/validations/menu-item'

async function getVenueSlug(supabase: Awaited<ReturnType<typeof createClient>>, venueId: string) {
  const { data } = await supabase.from('venues').select('slug').eq('id', venueId).single()
  return data?.slug ?? null
}

export async function createCategory(formData: unknown) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const parsed = categorySchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { data, error } = await supabase
    .from('categories')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return { error: error.message }

  const slug = await getVenueSlug(supabase, parsed.data.venue_id)
  if (slug) revalidatePath(`/p/${slug}`)
  revalidatePath(`/venues/${parsed.data.venue_id}/menu`)

  return { data }
}

export async function updateCategory(id: string, formData: Partial<{ name: string; visible: boolean; position: number }>) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const { data, error } = await supabase
    .from('categories')
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  const slug = await getVenueSlug(supabase, data.venue_id)
  if (slug) revalidatePath(`/p/${slug}`)
  revalidatePath(`/venues/${data.venue_id}/menu`)

  return { data }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const { data: category } = await supabase.from('categories').select('venue_id').eq('id', id).single()

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }

  if (category) {
    const slug = await getVenueSlug(supabase, category.venue_id)
    if (slug) revalidatePath(`/p/${slug}`)
    revalidatePath(`/venues/${category.venue_id}/menu`)
  }

  return { data: true }
}

export async function reorderCategories(venueId: string, orderedIds: string[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const updates = orderedIds.map((id, index) =>
    supabase.from('categories').update({ position: index }).eq('id', id)
  )

  await Promise.all(updates)

  const slug = await getVenueSlug(supabase, venueId)
  if (slug) revalidatePath(`/p/${slug}`)
  revalidatePath(`/venues/${venueId}/menu`)

  return { data: true }
}
