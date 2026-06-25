'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(plan: 'pro' | 'chain') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('owner_id', user.id)
    .single()

  const priceId = plan === 'chain'
    ? process.env.STRIPE_PRICE_CHAIN_MONTHLY!
    : process.env.STRIPE_PRICE_PRO_MONTHLY!

  const session = await stripe.checkout.sessions.create({
    customer: subscription?.stripe_customer_id,
    customer_email: subscription?.stripe_customer_id ? undefined : user.email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { owner_id: user.id },
  })

  if (!session.url) return { error: 'Failed to create checkout session' }

  redirect(session.url)
}

export async function createPortalSession() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('owner_id', user.id)
    .single()

  if (!subscription?.stripe_customer_id) return { error: 'No billing account found' }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  })

  redirect(session.url)
}
