import { z } from 'zod'

export const menuItemSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  old_price: z.number().min(0).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  visible: z.boolean().default(true),
  unavailable: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  position: z.number().int().default(0),
})

export const categorySchema = z.object({
  venue_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  position: z.number().int().default(0),
  visible: z.boolean().default(true),
})

export type MenuItemInput = z.infer<typeof menuItemSchema>
export type CategoryInput = z.infer<typeof categorySchema>
