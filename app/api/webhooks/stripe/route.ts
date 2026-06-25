import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { syncSubscription, cancelSubscription } from '@/lib/stripe/webhooks'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const body = await req.text()

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await syncSubscription(event.data.object)
        break
      case 'customer.subscription.deleted':
        await cancelSubscription(event.data.object)
        break
      default:
        break
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Handler error'
    console.error(`Webhook handler error for ${event.type}:`, message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
