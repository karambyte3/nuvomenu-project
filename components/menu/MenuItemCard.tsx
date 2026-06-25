'use client'

import { useState } from 'react'
import { updateMenuItem, deleteMenuItem } from '@/actions/menu-items'
import { formatPrice } from '@/lib/utils'
import type { Database } from '@/types/database.types'

type MenuItem = Database['public']['Tables']['menu_items']['Row']

export function MenuItemCard({
  item,
  onUpdate,
  onDelete,
}: {
  item: MenuItem
  onUpdate: (updated: Partial<MenuItem> & { id: string }) => void
  onDelete: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleToggle(field: 'visible' | 'unavailable' | 'is_new' | 'is_featured') {
    setLoading(true)
    const updated = { [field]: !item[field] }
    await updateMenuItem(item.id, updated)
    onUpdate({ id: item.id, ...updated })
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${item.name}"?`)) return
    await deleteMenuItem(item.id)
    onDelete()
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border"
      style={{ borderColor: 'var(--teal-tint)', opacity: item.unavailable ? 0.6 : 1 }}
    >
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate" style={{ color: 'var(--ink)' }}>{item.name}</p>
          {item.is_new && (
            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--amber-accent)', color: 'white' }}>New</span>
          )}
          {item.is_featured && (
            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--teal-tint)', color: 'var(--teal-deep)' }}>Featured</span>
          )}
        </div>
        {item.description && (
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--stone)' }}>{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {item.old_price && (
            <span className="text-xs line-through" style={{ color: 'var(--stone)' }}>{formatPrice(item.old_price)}</span>
          )}
          {item.price !== null && (
            <span className="text-sm font-semibold" style={{ color: 'var(--teal-deep)' }}>{formatPrice(item.price)}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0" style={{ opacity: loading ? 0.5 : 1 }}>
        <button
          onClick={() => handleToggle('visible')}
          className="text-xs px-2 py-1 rounded-md"
          style={{
            backgroundColor: item.visible ? 'var(--teal-tint)' : '#f3f4f6',
            color: item.visible ? 'var(--teal-deep)' : 'var(--stone)',
          }}
          title="Toggle visibility"
        >
          {item.visible ? '👁' : '🙈'}
        </button>
        <button
          onClick={() => handleToggle('unavailable')}
          className="text-xs px-2 py-1 rounded-md"
          style={{
            backgroundColor: item.unavailable ? '#fef3c7' : '#f3f4f6',
            color: item.unavailable ? '#b45309' : 'var(--stone)',
          }}
          title="Toggle availability"
        >
          {item.unavailable ? 'Unavail.' : 'Avail.'}
        </button>
        <button
          onClick={handleDelete}
          className="text-xs px-2 py-1 rounded-md hover:bg-red-50"
          style={{ color: 'var(--stone)' }}
          title="Delete item"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
