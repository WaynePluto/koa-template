import type { Context, Next } from 'koa'

export function bodyParseJSON() {
  const getBody = ({ req }: Context) => {
    return new Promise(resolve => {
      if (req.headers['content-type'] === 'application/json') {
        let body = ''
        req.on('data', chunk => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            resolve(data)
          } catch (err) {
            console.error(err)
            resolve({})
          }
        })
      } else {
        resolve({})
      }
    })
  }

  return async (ctx: Context, next: Next) => {
    const body: any = await getBody(ctx)
    ctx.request.body = body
    await next()
  }
}
