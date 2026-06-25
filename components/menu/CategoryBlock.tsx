'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuItemCard } from './MenuItemCard'
import { ItemForm } from './ItemForm'
import { updateCategory, deleteCategory } from '@/actions/categories'
import type { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row'] & {
  menu_items: Database['public']['Tables']['menu_items']['Row'][]
}

export function CategoryBlock({
  category,
  onUpdate,
  onDelete,
  onItemsChange,
}: {
  category: Category
  onUpdate: (updated: Partial<Category>) => void
  onDelete: () => void
  onItemsChange: (items: Database['public']['Tables']['menu_items']['Row'][]) => void
}) {
  const [showItemForm, setShowItemForm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  async function handleRename() {
    if (name === category.name || !name.trim()) { setEditing(false); return }
    await updateCategory(category.id, { name: name.trim() })
    onUpdate({ name: name.trim() })
    setEditing(false)
  }

  async function handleToggleVisible() {
    await updateCategory(category.id, { visible: !category.visible })
    onUpdate({ visible: !category.visible })
  }

  async function handleDelete() {
    if (!confirm(`Delete category "${category.name}" and all its items?`)) return
    await deleteCategory(category.id)
    onDelete()
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderColor: 'var(--teal-soft)' }}
      className="bg-white rounded-2xl border overflow-hidden"
    >
      <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: 'var(--teal-tint)' }}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>

        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="flex-1 font-semibold text-sm border-b outline-none"
            style={{ borderColor: 'var(--teal-primary)', color: 'var(--ink)' }}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex-1 text-left font-semibold text-sm hover:underline"
            style={{ color: 'var(--ink)' }}
          >
            {category.name}
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleToggleVisible}
            className="text-xs px-2 py-1 rounded-md"
            style={{
              backgroundColor: category.visible ? 'var(--teal-tint)' : '#f3f4f6',
              color: category.visible ? 'var(--teal-deep)' : 'var(--stone)',
            }}
          >
            {category.visible ? 'Visible' : 'Hidden'}
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-2 py-1 rounded-md hover:bg-red-50"
            style={{ color: 'var(--stone)' }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="px-5 py-3 space-y-2">
        {category.menu_items.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: 'var(--stone)' }}>No items yet</p>
        )}
        {category.menu_items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onUpdate={(updated) =>
              onItemsChange(category.menu_items.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)))
            }
            onDelete={() => onItemsChange(category.menu_items.filter((i) => i.id !== item.id))}
          />
        ))}

        {showItemForm ? (
          <ItemForm
            categoryId={category.id}
            onSave={(newItem) => {
              onItemsChange([...category.menu_items, newItem])
              setShowItemForm(false)
            }}
            onCancel={() => setShowItemForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowItemForm(true)}
            className="w-full py-2 text-sm rounded-lg border border-dashed mt-2"
            style={{ borderColor: 'var(--teal-soft)', color: 'var(--teal-primary)' }}
          >
            + Add item
          </button>
        )}
      </div>
    </div>
  )
}
