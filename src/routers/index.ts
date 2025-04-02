import Router from '../libs/router'
import { initTemplateRouter } from './template'

export const initRouter = () => {
  const router = new Router()

  initTemplateRouter(router)

  return router.init()
}
