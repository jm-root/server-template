const { ObjectId } = require('bson')

/**
 * 生成ObjectId
 * @returns {String}
 */
module.exports = function genId () {
  return new ObjectId().toString()
}
