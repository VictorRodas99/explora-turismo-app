import { API_STATES } from '@/pages/api/_states'
import * as z from 'zod'

const dataSchema = z.object({
  statusText: z.enum([API_STATES.error, API_STATES.success]),
  data: z.any().or(z.string())
})

export type Data = z.infer<typeof dataSchema>

export const apiResponseSchema = z.object({
  data: dataSchema
})

export type ApiResponse = z.infer<typeof apiResponseSchema>
