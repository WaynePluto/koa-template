const getUUID = require('../utils/get-uuid')

/** 数据表名 */
const TableName = 'template'
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(TableName).del()
  const [id] = await knex(TableName).insert({
    name: '测试',
  })
  await knex(TableName)
    .where({ id })
    .update({
      uuid: getUUID(id),
    })
}
