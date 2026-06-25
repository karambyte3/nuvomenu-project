'use client'

import { useState } from 'react'
import { createMenuItem } from '@/actions/menu-items'
import type { Database } from '@/types/database.types'

type MenuItem = Database['public']['Tables']['menu_items']['Row']

export function ItemForm({
  categoryId,
  onSave,
  onCancel,
}: {
  categoryId: string
  onSave: (item: MenuItem) => void
  onCancel: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const priceRaw = (form.elements.namedItem('price') as HTMLInputElement).value
    const oldPriceRaw = (form.elements.namedItem('old_price') as HTMLInputElement).value

    const result = await createMenuItem({
      category_id: categoryId,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLInputElement).value || null,
      price: priceRaw ? parseFloat(priceRaw) : null,
      old_price: oldPriceRaw ? parseFloat(oldPriceRaw) : null,
      position: 0,
    })

    if ('error' in result) {
      setError(typeof result.error === 'string' ? result.error : 'Validation error')
      setLoading(false)
      return
    }

    onSave(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-4 space-y-3 bg-[var(--teal-tint)]" style={{ borderColor: 'var(--teal-soft)' }}>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink)' }}>Name *</label>
          <input
            name="name"
            required
            placeholder="e.g. Margherita Pizza"
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
            style={{ borderColor: 'var(--teal-soft)' }}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink)' }}>Description</label>
          <input
            name="description"
            placeholder="Short description"
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
            style={{ borderColor: 'var(--teal-soft)' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink)' }}>Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="12.00"
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
            style={{ borderColor: 'var(--teal-soft)' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink)' }}>Old price (promo)</label>
          <input
            name="old_price"
            type="number"
            step="0.01"
            min="0"
            placeholder="15.00"
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
            style={{ borderColor: 'var(--teal-soft)' }}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg text-sm border"
          style={{ borderColor: 'var(--teal-soft)', color: 'var(--stone)' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: 'var(--teal-primary)' }}
        >
          {loading ? 'Saving…' : 'Add item'}
        </button>
      </div>
    </form>
  )
}
