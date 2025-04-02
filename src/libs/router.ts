import { METHODS } from 'http'
import { type Middleware } from 'koa'
import compose from 'koa-compose'

type HttpMethod = 'get' | 'post' | 'put' | 'delete'

/** 请求方法中间件映射字典 */
type MethodMiddlewareMap = Map<string, Middleware[]>

/** 请求路由中间件映射字典 */
type PathMiddlewareMap = Map<string, MethodMiddlewareMap>

/** 正则匹配请求方法中间件字典 */
type RegExpMethodMiddlewareMap = Map<RegExp, Middleware[]>

/** 正则匹配路径中间件字典 */
type RegExpPathMiddlewareMap = Map<RegExp, RegExpMethodMiddlewareMap>

/** 局部路由 */
type Route = {
  // 通过http请求方法挂载中间件
  [key in HttpMethod]: (path: string, ...mids: Middleware[]) => void
}

/** 修改路径格式，增加/前缀，删除/后缀，如果是根路径，变为空 */
const formatPath = (path: string) => {
  path = path.startsWith('/') ? path : `/${path}`
  path = path.endsWith('/') ? path.slice(0, -1) : path
  return path
}

export default class Router {
  /** 精确匹配路径与请求方法的中间件字典 */
  private pathMiddlewareMap: PathMiddlewareMap = new Map()

  /** 全局路由对象添加的中间件，正则匹配路径 */
  private regPathMiddlewareMap: RegExpPathMiddlewareMap = new Map()

  /** 创建分组路由 */
  createRoute(prefix = '/') {
    const route = {} as Route
    // 给分组路由定义挂载方法
    METHODS.forEach(method => {
      const methodKey = method.toLowerCase() as HttpMethod
      route[methodKey] = (path, ...middlewares) => {
        prefix = formatPath(prefix)
        path = formatPath(path)
        const url = prefix + path

        if (!this.pathMiddlewareMap.has(url)) {
          this.pathMiddlewareMap.set(url, new Map())
        }
        const pathMidMap = this.pathMiddlewareMap.get(url)!

        if (pathMidMap.has(methodKey)) {
          throw new Error(`重复定义路由:${url}, 方法: ${methodKey} 。`)
        } else {
          pathMidMap.set(methodKey, middlewares)
        }
      }
    })
    return route
  }

  /** 创建正则匹配中间件 */
  use(pathReg: RegExp = /.*/, methodReg: RegExp = /.*/, ...middlewares: Middleware[]) {
    if (!this.regPathMiddlewareMap.has(pathReg)) {
      this.regPathMiddlewareMap.set(pathReg, new Map())
    }

    const regMidMap = this.regPathMiddlewareMap.get(pathReg)!

    if (regMidMap.has(methodReg)) {
      throw new Error(`重复定义正则匹配中间件: ${pathReg}, ${methodReg}`)
    } else {
      regMidMap.set(methodReg, middlewares)
    }
  }

  init(): Middleware {
    return async (ctx, next) => {
      const method = ctx.method.toLowerCase()
      const path = ctx.path
      const controllers = this.pathMiddlewareMap.get(path)?.get(method)
      if (!controllers || controllers.length === 0) {
        ctx.body = { code: 404, msg: `没有找到路由: ${ctx.method} ${ctx.path} 对应的控制器` }
        return
      }
      const regMids: Middleware[] = []
      this.regPathMiddlewareMap.forEach((methodMap, pathReg) => {
        if (pathReg.test(ctx.path)) {
          methodMap.forEach((mids, methodReg) => {
            if (methodReg.test(method)) {
              regMids.push(...mids)
            }
          })
        }
      })

      const middlewares = [...regMids, ...controllers]
      const fn = compose(middlewares)
      await fn(ctx, next)
    }
  }
}
