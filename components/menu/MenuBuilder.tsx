'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CategoryBlock } from './CategoryBlock'
import type { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row'] & {
  menu_items: Database['public']['Tables']['menu_items']['Row'][]
}
type MenuItem = Database['public']['Tables']['menu_items']['Row']

interface MenuBuilderProps {
  venueId: string
  venueSlug: string
  initialCategories: Category[]
  createCategory: (data: unknown) => Promise<{ data: Category } | { error: unknown }>
  updateCategory: (id: string, data: unknown) => Promise<{ data: unknown } | { error: unknown }>
  deleteCategory: (id: string) => Promise<{ data: unknown } | { error: unknown }>
  reorderCategories: (venueId: string, ids: string[]) => Promise<{ data: unknown } | { error: unknown }>
  createMenuItem: (data: unknown) => Promise<{ data: MenuItem } | { error: unknown }>
  updateMenuItem: (id: string, data: unknown) => Promise<{ data: unknown } | { error: unknown }>
  deleteMenuItem: (id: string) => Promise<{ data: unknown } | { error: unknown }>
}

export function MenuBuilder({
  venueId,
  initialCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
}: MenuBuilderProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    const result = await createCategory({
      venue_id: venueId,
      name: newCategoryName.trim(),
      position: categories.length,
    })

    if ('data' in result && result.data) {
      setCategories((prev) => [...prev, { ...result.data!, menu_items: [] }])
      setNewCategoryName('')
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setCategories((cats) => {
      const oldIndex = cats.findIndex((c) => c.id === active.id)
      const newIndex = cats.findIndex((c) => c.id === over.id)
      const reordered = arrayMove(cats, oldIndex, newIndex)

      startTransition(() => {
        reorderCategories(venueId, reordered.map((c) => c.id))
      })

      return reordered
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {categories.map((category) => (
            <CategoryBlock
              key={category.id}
              category={category}
              onUpdate={(updated) =>
                setCategories((cats) => cats.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)))
              }
              onDelete={() => setCategories((cats) => cats.filter((c) => c.id !== category.id))}
              onItemsChange={(items) =>
                setCategories((cats) =>
                  cats.map((c) => (c.id === category.id ? { ...c, menu_items: items } : c))
                )
              }
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
              createMenuItem={createMenuItem}
              updateMenuItem={updateMenuItem}
              deleteMenuItem={deleteMenuItem}
            />
          ))}
        </SortableContext>
      </DndContext>

      <form onSubmit={handleAddCategory} className="flex gap-3">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name (e.g. Starters)"
          className="flex-1 px-3 py-2.5 rounded-lg border text-sm outline-none"
          style={{ borderColor: 'var(--teal-soft)', backgroundColor: 'white' }}
        />
        <button
          type="submit"
          disabled={!newCategoryName.trim() || isPending}
          className="px-4 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: 'var(--teal-primary)' }}
        >
          Add category
        </button>
      </form>
    </div>
  )
}
