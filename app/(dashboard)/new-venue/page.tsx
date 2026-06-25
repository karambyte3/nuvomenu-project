import type { Metadata } from 'next'
import { NewVenueForm } from './NewVenueForm'

export const metadata: Metadata = { title: 'Create venue' }

export default function NewVenuePage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Create a new venue</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--stone)' }}>
        Your venue will get a unique URL and QR code instantly.
      </p>
      <NewVenueForm />
    </div>
  )
}
