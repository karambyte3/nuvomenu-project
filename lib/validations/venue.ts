import { z } from 'zod'

export const venueSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  wifi_password: z.string().max(100).optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  cover_url: z.string().url().optional().nullable(),
})

export type VenueInput = z.infer<typeof venueSchema>
