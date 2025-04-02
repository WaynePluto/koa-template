import type { Context, Next } from 'koa'

export function catchError() {
  return async (ctx: Context, next: Next) => {
    try {
      await next()
    } catch (error) {
      console.log('====== 内部出错:', error)
      ctx.body = { code: 500, msg: '内部错误' }
    }
  }
}
