import {
  createTemplate,
  deleteTemplate,
  findTemplate,
  findTemplatePage,
  tagDeleteTemplate,
  updateTemplate,
} from '@/controllers/template'
import Router from '@/libs/router'
import { validateBody, validateQuery } from '@/middlewares/validator'
import { createTemplateValidator } from '@/models/template'
import { pageValidator, uuidArrValidator, uuidValidator } from '@/utils/validator'

export const initTemplateRouter = (router: Router) => {
  const prefix = 'template'
  const route = router.createRoute(prefix)
  route.post('/', validateBody(createTemplateValidator), createTemplate)
  route.get('/', validateQuery(uuidValidator), findTemplate)
  route.put('/', validateBody(uuidValidator.merge(createTemplateValidator)), updateTemplate)
  route.delete('/tag', validateBody(uuidArrValidator), tagDeleteTemplate)
  route.delete('/danger', validateBody(uuidArrValidator), deleteTemplate)
  route.get('/list', validateBody(pageValidator.merge(createTemplateValidator.partial())), findTemplatePage)
}
