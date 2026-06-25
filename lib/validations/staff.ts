import { z } from 'zod'

export const staffInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  venue_id: z.string().uuid(),
  role: z.enum(['editor', 'viewer']),
})

export type StaffInviteInput = z.infer<typeof staffInviteSchema>
