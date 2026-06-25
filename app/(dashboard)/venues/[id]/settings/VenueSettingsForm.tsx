'use client'

import { useState } from 'react'
import { updateVenue } from '@/actions/venues'
import type { Database } from '@/types/database.types'

type Venue = Database['public']['Tables']['venues']['Row']

export function VenueSettingsForm({ venue }: { venue: Venue }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value || null,
      address: (form.elements.namedItem('address') as HTMLInputElement).value || null,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value || null,
      wifi_password: (form.elements.namedItem('wifi_password') as HTMLInputElement).value || null,
    }

    const result = await updateVenue(venue.id, data)

    if ('error' in result) {
      setError(typeof result.error === 'string' ? result.error : 'Validation error')
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: 'var(--teal-soft)' }}>
      {[
        { name: 'name', label: 'Venue name', type: 'text', defaultValue: venue.name, required: true },
        { name: 'address', label: 'Address', type: 'text', defaultValue: venue.address ?? '' },
        { name: 'phone', label: 'Phone', type: 'tel', defaultValue: venue.phone ?? '' },
        { name: 'wifi_password', label: 'Wi-Fi password', type: 'text', defaultValue: venue.wifi_password ?? '' },
      ].map(({ name, label, type, defaultValue, required }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
            {label}{required && <span style={{ color: 'var(--teal-primary)' }}> *</span>}
          </label>
          <input
            name={name}
            type={type}
            required={required}
            defaultValue={defaultValue}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: 'var(--teal-soft)' }}
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={venue.description ?? ''}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
          style={{ borderColor: 'var(--teal-soft)' }}
        />
      </div>
      <div className="pt-1 flex items-center gap-3">
        <div className="text-sm" style={{ color: 'var(--stone)' }}>
          Public URL: <code className="text-xs" style={{ color: 'var(--teal-deep)' }}>/p/{venue.slug}</code>
          <span className="ml-1 text-xs">(permanent)</span>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm" style={{ color: 'var(--teal-primary)' }}>Saved!</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-50"
        style={{ backgroundColor: 'var(--teal-primary)' }}
      >
        {loading ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
