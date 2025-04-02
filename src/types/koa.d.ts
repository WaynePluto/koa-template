import type { Knex } from 'knex'
import 'koa'
import winston from 'winston'

interface Body {
  [key: string]: any
}
declare module 'koa' {
  interface Request {
    body: Body
  }

  interface ExtendableContext {
    knexBuilder: <T extends IDocument>(table: string) => Knex.QueryBuilder<T, T[]>
    knex: Knex
    logger: winston.Logger
    jwtSign: (payload: any) => {
      token: string
      refresh_token: string
    }
  }
}
