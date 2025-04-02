import knex, { Knex } from 'knex'
import { Middleware } from 'koa'

/** 配置knex连接信息 */
export const configKnex = (params: { host; database; user; password }) => {
  const { host, database, user, password } = params
  const config = {
    client: 'mysql2',
    connection: {
      host,
      database,
      user,
      password,
    },
    pool: { min: 1, max: 3 },
  }

  return knex(config)
}
/** 获取一个构造器 */
export const getKnexBuilder = (knexInst: knex.Knex<any, unknown[]>) => {
  const queryBuilder = (_knex: Knex) => {
    return <T extends IDocument>(table: string) => _knex<T, T[]>(table)
  }
  return queryBuilder(knexInst)
}

/** 初始化knex，挂载到koa上下文中 */
export const initKnex = (inst: knex.Knex<any, unknown[]>): Middleware => {
  const builder = getKnexBuilder(inst)

  return async (ctx, next) => {
    ctx.knex = inst
    ctx.knexBuilder = builder
    await next()
  }
}
