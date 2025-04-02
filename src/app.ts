import cors from '@koa/cors'
import Koa from 'koa'
import rateLimit from 'koa-ratelimit'
import { RateLimitConfig } from './configs/rate-limit'
import { configKnex, initKnex } from './libs/knex'
import { bodyParseJSON } from './middlewares/body-parse-json'
import { catchError } from './middlewares/catch-error'
import { initJwt } from './middlewares/jwt'
import { createLogger, initLogger } from './middlewares/logger'
import { initRouter } from './routers'

const boot = async () => {
  const { PORT, JWT_SECRET = '', HOST, DATABASE, USER, PASSWORD } = process.env
  const app = new Koa()
  app.use(catchError())
  app.use(cors())
  app.use(rateLimit(RateLimitConfig))

  const logger = createLogger()
  app.use(initLogger(logger))

  app.use(initJwt(JWT_SECRET))

  app.use(bodyParseJSON())

  const inst = configKnex({ host: HOST, database: DATABASE, user: USER, password: PASSWORD })
  app.use(initKnex(inst))

  app.use(initRouter())

  app.listen(PORT, () => {
    logger.info(`Server running at http://127.0.0.1:${PORT}/`)
  })
}

boot()
