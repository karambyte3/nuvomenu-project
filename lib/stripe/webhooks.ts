import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import type { Database } from '@/types/database.types'

// Webhooks use service role — only place it is allowed
function getServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function syncSubscription(subscription: Stripe.Subscription) {
  const supabase = getServiceClient()

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id

  const plan = getPlanFromSubscription(subscription)

  // current_period_end may live on the subscription or its items depending on Stripe version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const periodEnd = (subscription as any).current_period_end as number | undefined

  const { error } = await supabase.from('subscriptions').upsert(
    // owner_id is populated on first insert by the application; on update, stripe_customer_id is the conflict key
    {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan,
      status: subscription.status,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    } as Database['public']['Tables']['subscriptions']['Insert'],
    { onConflict: 'stripe_customer_id' }
  )

  if (error) console.error('syncSubscription error:', error)
}

export async function cancelSubscription(subscription: Stripe.Subscription) {
  const supabase = getServiceClient()

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId)

  if (error) console.error('cancelSubscription error:', error)
}

function getPlanFromSubscription(subscription: Stripe.Subscription): 'trial' | 'pro' | 'chain' {
  const priceId = subscription.items.data[0]?.price.id
  if (priceId === process.env.STRIPE_PRICE_CHAIN_MONTHLY) return 'chain'
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return 'pro'
  return 'trial'
}
