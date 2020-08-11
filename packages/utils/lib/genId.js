const { ObjectId } = require('bson')
const intformat = require('biguint-format')
const FlakeId = require('flake-idgen')
const flakeIdGen = new FlakeId({ epoch: 1111110000000 })

function genObjectId () {
  return new ObjectId().toString()
}

function genFlakeId () {
  return intformat(flakeIdGen.next(), 'dec')
}

/**
 * 生成全局唯一id
 * @returns {String}
 */
module.exports = {
  genObjectId,
  genFlakeId
}
