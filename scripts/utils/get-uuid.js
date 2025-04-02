const uuid = require('uuid')
/**
 * uuid v5 自定义命名空间
 *
 */
const UUIDSPACE = uuid.v5('namespace', uuid.v5.URL)

const getUUID = id => uuid.v5(id.toString(), UUIDSPACE).replace(/-/g, '')

module.exports = getUUID
