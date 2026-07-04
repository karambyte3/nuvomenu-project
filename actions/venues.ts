'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { venueSchema } from '@/lib/validations/venue'

import { slugify } from '@/lib/utils'

export async function createVenue(formData: unknown) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const parsed = venueSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const baseSlug = slugify(parsed.data.name)
  let slug = baseSlug
  let attempt = 0

  // Ensure slug uniqueness
  while (true) {
    const { data: existing } = await supabase
      .from('venues')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!existing) break
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const { data, error } = await supabase
    .from('venues')
    .insert({ ...parsed.data, owner_id: user.id, slug })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/venues')
  return { data }
}

export async function updateVenue(id: string, formData: unknown) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const parsed = venueSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { data, error } = await supabase
    .from('venues')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/venues')
  revalidatePath(`/venues/${id}`)
  if (data.slug) revalidatePath(`/p/${data.slug}`)

  return { data }
}

export async function deleteVenue(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const { error } = await supabase
    .from('venues')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/venues')
  return { data: true }
}
