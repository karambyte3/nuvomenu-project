import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { acceptInvite } from '@/actions/staff'

export const metadata: Metadata = { title: 'Accept invitation' }

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Validate the token
  const { data: invite } = await supabase
    .from('staff_members')
    .select('id, venue_id, email, role, venues(name)')
    .eq('invite_token', token)
    .is('accepted_at', null)
    .single()

  if (!invite) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Invalid invitation</h1>
        <p className="text-sm" style={{ color: 'var(--stone)' }}>
          This invitation link is invalid or has already been used.
        </p>
      </div>
    )
  }

  const venueName = (invite.venues as { name: string } | null)?.name ?? 'a venue'

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>You&apos;ve been invited</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--stone)' }}>
          You&apos;ve been invited to manage <strong>{venueName}</strong> as a {invite.role}.
        </p>
        <p className="text-sm" style={{ color: 'var(--stone)' }}>
          <a href={`/signup?invite=${token}`} style={{ color: 'var(--teal-primary)' }}>Create an account</a>
          {' '}or{' '}
          <a href={`/login?invite=${token}`} style={{ color: 'var(--teal-primary)' }}>log in</a>
          {' '}to accept this invitation.
        </p>
      </div>
    )
  }

  // Auto-accept if already logged in
  const result = await acceptInvite(token, user.id)

  if ('error' in result) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-600">{result.error}</p>
      </div>
    )
  }

  redirect(`/venues/${invite.venue_id}`)
}
