import { Middleware } from 'koa'
import { ZodSchema, ZodType } from 'zod'

export const validateQuery = <T extends ZodType>(data: T): Middleware => {
  return async (ctx, next) => {
    const res = await data.safeParseAsync(ctx.query)
    if (res.success) {
      ctx.query = res.data
      await next()
    } else {
      ctx.body = res.error
    }
  }
}
export const validateBody = <T extends ZodSchema>(data: T): Middleware => {
  return async (ctx, next) => {
    const res = await data.safeParseAsync(ctx.request.body)
    if (res.success) {
      ctx.request.body = res.data
      await next()
    } else {
      ctx.body = { code: 400, error: res.error, msg: '请求数据出错~' }
    }
  }
}
