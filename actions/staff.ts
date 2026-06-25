'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { staffInviteSchema } from '@/lib/validations/staff'
import crypto from 'crypto'

export async function inviteStaff(formData: unknown) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const parsed = staffInviteSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  // Verify caller owns the venue
  const { data: venue } = await supabase
    .from('venues')
    .select('id, name')
    .eq('id', parsed.data.venue_id)
    .eq('owner_id', user.id)
    .single()

  if (!venue) return { error: 'Venue not found or access denied' }

  const inviteToken = crypto.randomBytes(32).toString('hex')
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`

  const { data, error } = await supabase
    .from('staff_members')
    .insert({
      venue_id: parsed.data.venue_id,
      email: parsed.data.email,
      role: parsed.data.role,
      invite_token: inviteToken,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // TODO: send invite email via Resend (Phase 4)

  revalidatePath(`/venues/${parsed.data.venue_id}/settings`)
  return { data, inviteUrl }
}

export async function acceptInvite(token: string, userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_members')
    .update({ user_id: userId, accepted_at: new Date().toISOString(), invite_token: null })
    .eq('invite_token', token)
    .select()
    .single()

  if (error) return { error: error.message }

  return { data }
}

export async function removeStaff(staffId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const { data: member } = await supabase
    .from('staff_members')
    .select('venue_id')
    .eq('id', staffId)
    .single()

  if (!member) return { error: 'Staff member not found' }

  // Verify caller owns the venue
  const { data: venue } = await supabase
    .from('venues')
    .select('id')
    .eq('id', member.venue_id)
    .eq('owner_id', user.id)
    .single()

  if (!venue) return { error: 'Access denied' }

  const { error } = await supabase.from('staff_members').delete().eq('id', staffId)
  if (error) return { error: error.message }

  revalidatePath(`/venues/${member.venue_id}/settings`)
  return { data: true }
}
