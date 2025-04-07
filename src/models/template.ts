import { z } from 'zod'
import { BaseModel } from './base'

export interface TemplateModel extends BaseModel {
  name: string
}

export const createTemplateValidator = z.object({
  name: z.string(),
})
