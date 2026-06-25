'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createVenue } from '@/actions/venues'

export function NewVenueForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value || null,
      address: (form.elements.namedItem('address') as HTMLInputElement).value || null,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value || null,
    }

    const result = await createVenue(data)

    if ('error' in result) {
      setError(typeof result.error === 'string' ? result.error : 'Validation error')
      setLoading(false)
      return
    }

    router.push(`/venues/${result.data.id}/menu`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: 'var(--teal-soft)' }}>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
          Venue name <span style={{ color: 'var(--teal-primary)' }}>*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="e.g. The Green Fork"
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: 'var(--teal-soft)' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="A short description of your venue"
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
          style={{ borderColor: 'var(--teal-soft)' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Address</label>
        <input
          name="address"
          type="text"
          placeholder="123 Main St, City"
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: 'var(--teal-soft)' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Phone</label>
        <input
          name="phone"
          type="tel"
          placeholder="+1 555 000 0000"
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: 'var(--teal-soft)' }}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium border"
          style={{ borderColor: 'var(--teal-soft)', color: 'var(--stone)' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: 'var(--teal-primary)' }}
        >
          {loading ? 'Creating…' : 'Create venue'}
        </button>
      </div>
    </form>
  )
}
