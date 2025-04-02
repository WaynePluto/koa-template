/** 数据表名 */
const TableName = 'template'
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => {
  const getCommonTool = require('../common')
  const { addCommonFileds } = getCommonTool(knex)
  return knex.schema.createTable(TableName, table => {
    // 通用字段
    addCommonFileds(table)
    table.comment('数据表模板')
    // 其他字段
    table.string('name', 100).comment('名称')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => {
  return knex.schema.dropTable(TableName)
}
