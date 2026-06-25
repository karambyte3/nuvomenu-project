import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createPortalSession } from '@/actions/billing'

export const metadata: Metadata = { title: 'Account' }

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user!.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status, trial_ends_at, current_period_end, stripe_subscription_id')
    .eq('owner_id', user!.id)
    .single()

  const planLabel = subscription?.plan ?? 'trial'
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--ink)' }}>Account</h1>

      <section className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: 'var(--teal-soft)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--ink)' }}>Profile</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span style={{ color: 'var(--stone)' }}>Name</span>
            <span style={{ color: 'var(--ink)' }}>{profile?.full_name ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--stone)' }}>Email</span>
            <span style={{ color: 'var(--ink)' }}>{user!.email}</span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border p-6" style={{ borderColor: 'var(--teal-soft)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--ink)' }}>Subscription</h2>
        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span style={{ color: 'var(--stone)' }}>Plan</span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
              style={{ backgroundColor: 'var(--teal-tint)', color: 'var(--teal-deep)' }}
            >
              {planLabel}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--stone)' }}>Status</span>
            <span style={{ color: isActive ? 'var(--teal-primary)' : 'var(--stone)' }}>
              {subscription?.status ?? 'Trial'}
            </span>
          </div>
          {subscription?.trial_ends_at && (
            <div className="flex justify-between">
              <span style={{ color: 'var(--stone)' }}>Trial ends</span>
              <span style={{ color: 'var(--ink)' }}>
                {new Date(subscription.trial_ends_at).toLocaleDateString()}
              </span>
            </div>
          )}
          {subscription?.current_period_end && (
            <div className="flex justify-between">
              <span style={{ color: 'var(--stone)' }}>Next billing</span>
              <span style={{ color: 'var(--ink)' }}>
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {planLabel === 'trial' && (
            <a
              href="/pricing"
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: 'var(--teal-primary)' }}
            >
              Upgrade plan
            </a>
          )}
          {subscription?.stripe_subscription_id && (
            <form action={async () => { 'use server'; await createPortalSession() }}>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: 'var(--teal-soft)', color: 'var(--teal-deep)' }}
              >
                Manage billing
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
