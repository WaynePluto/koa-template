/**
 *
 * @param {import("knex").Knex} knex
 */

const getCommonTool = knex => {
  /**
   * 增加数据表通用字段
   * @param {import('knex').Knex.CreateTableBuilder} table
   * @returns
   */
  const addCommonFileds = table => {
    table.charset('utf8mb4')
    table.collate('utf8mb4_unicode_ci')
    table.increments('id').primary().notNullable()
    table.string('uuid', 32).unique({ indexName: 'uuid_unique' }).defaultTo(null)
    table.tinyint('deleted', 1).index('is_delete_index').defaultTo(0).notNullable()
    table.datetime('created_time').defaultTo(knex.fn.now()).notNullable()
    table.datetime('updated_time').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable()
  }

  /**
   * 删除数据表通用字段
   * @param {import('knex').Knex.CreateTableBuilder} table
   * @returns
   */
  const removeCommonFileds = table => {
    table.dropColumn('uuid')
    table.dropColumn('is_delete')
    table.dropColumn('create_time')
    table.dropColumn('update_time')
  }

  /**
   * 添加触发器，自动更新时间
   * @param {string} tableName
   * @returns
   */
  const addTrigger = tableName => {
    return knex.raw(`
      CREATE TRIGGER auto_update_time BEFORE UPDATE ON ${tableName}
      FOR EACH ROW
      SET NEW.update_time = NOW();
    `)
  }

  /**
   * 添加uuid和updated_time字段
   * @param {*} table
   */
  const addUUIDUpdateFileds = table => {
    table.string('uuid', 32).unique({ indexName: 'uuid_unique' }).defaultTo(null)
    table.datetime('updated_time').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable()
  }

  return { addCommonFileds, removeCommonFileds, addTrigger, addUUIDUpdateFileds }
}

module.exports = getCommonTool
