import { z } from 'zod'

export interface TemplateModel {
  id: number
  uuid: string
  name: string
  num: number
}

export const createTemplateValidator = z.object({
  name: z.string(),
})
