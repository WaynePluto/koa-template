import { z } from 'zod'

export const uuidValidator = z.object({
  uuid: z.string(),
})

export const pageValidator = z.object({
  page: z.number().min(1),
  pageSize: z.number().min(1),
})

export const uuidArrValidator = z.object({
  uuids: z.array(z.string()).min(1),
})
