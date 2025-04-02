import jwt from 'jsonwebtoken'
import { Middleware } from 'koa'
export const createJwtSign = (secret: string) => (payload: any) => {
  const token = jwt.sign(payload, secret, { expiresIn: '5m' })
  const refresh_token = jwt.sign(payload, secret, { expiresIn: '7d' })

  return { token, refresh_token }
}

export const createJwtVerify =
  (secret: string) =>
  (token: string): Promise<{ err: jwt.VerifyErrors | null; decoded: any }> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        resolve({ err, decoded })
      })
    })
  }

export const initJwt = (secret = 'jwt'): Middleware => {
  const jwtSign = createJwtSign(secret)
  const jwtVerify = createJwtVerify(secret)
  return async (ctx, next) => {
    ctx.jwtSign = jwtSign
    const ignoreRoute = /\/login$|\/register/
    if (ignoreRoute.test(ctx.url)) {
      await next()
    } else {
      const { authorization } = ctx.header
      const token = authorization?.split(' ')[1]
      if (token) {
        const { err, decoded } = await jwtVerify(token)
        if (err) {
          ctx.body = { code: 401, msg: 'token过期', data: jwtSign({ id: 1 }) }
        } else {
          await next()
        }
      } else {
        ctx.body = { code: 401, msg: 'token过期', data: jwtSign({ id: 1 }) }
      }
    }
  }
}
