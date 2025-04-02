import { TableName } from '@/configs/table-name'
import { TemplateModel } from '@/models/template'
import { getFindBuilder } from '@/utils/common-knex'
import { getUUID } from '@/utils/uuid'
import { Middleware } from 'koa'
import { omit } from 'lodash'

export const createTemplate: Middleware = async (ctx, next) => {
  const trx = await ctx.knex.transaction()
  try {
    const builder = () => trx<TemplateModel>(TableName.Template)
    const [id] = await builder().insert(ctx.request.body)
    const uuid = getUUID(id as unknown as number)
    const res = await builder().where('id', id).update({ uuid })
    await trx.commit()
    ctx.body = { code: res > 0 ? 200 : 500, data: res > 0 ? uuid : 0, msg: '操作成功' }
  } catch (error) {
    await trx.rollback()
    throw error
  }

  await next()
}

export const updateTemplate: Middleware = async (ctx, next) => {
  const builder = ctx.knexBuilder<TemplateModel>(TableName.Template)
  const { uuid } = ctx.request.body
  const data = omit(ctx.request.body, ['uuid'])
  const res = await builder.where('uuid', uuid).update(data)
  ctx.body = { code: 200, data: res, msg: '操作成功' }
  await next()
}

export const findTemplate: Middleware = async (ctx, next) => {
  const builder = ctx.knexBuilder<TemplateModel>(TableName.Template)
  const { uuid } = ctx.request.query
  const res = await builder.select('*').where('uuid', uuid).first()
  ctx.body = { code: 200, data: res, msg: '操作成功' }
  await next()
}

export const tagDeleteTemplate: Middleware = async (ctx, next) => {
  const builder = ctx.knexBuilder<TemplateModel>(TableName.Template)
  const { uuids } = ctx.request.body
  const res = await builder.whereIn('uuid', uuids).update('deleted', 1)
  ctx.body = { code: 200, data: res, msg: '操作成功' }
  await next()
}

export const deleteTemplate: Middleware = async (ctx, next) => {
  const builder = ctx.knexBuilder<TemplateModel>(TableName.Template)
  const { uuids } = ctx.request.body
  const res = await builder.whereIn('uuid', uuids).del()
  ctx.body = { code: 200, data: res, msg: '操作成功' }
  await next()
}

export const findTemplatePage: Middleware = async (ctx, next) => {
  const { page, pageSize } = ctx.request.body
  const offset = (page! - 1) * pageSize!
  const findParams = omit(ctx.request.body, ['page', 'pageSize'])

  const builder = () =>
    getFindBuilder(ctx.knexBuilder<TemplateModel>(TableName.Template), { ...findParams }, TableName.Template)

  const countRes = await builder().count({ count: '*' })
  const listRes = await builder().select('*').limit(pageSize).offset(offset)

  ctx.body = { code: 200, data: { list: listRes, total: countRes[0].count ?? 0 }, msg: 'success' }
  await next()
}
