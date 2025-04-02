const getUUID = require('./get-uuid')

const insertUUID = async (builder, id) => {
  const res = await builder()
    .where({ id })
    .update({
      uuid: getUUID(id),
    })
  return res
}

module.exports = insertUUID
