const error = require('jm-err')
const { Err } = require('consts')
const log = require('jm-log4js')
const logger = log.getLogger('wms')
const { toNumber, getField } = require('./utils')

module.exports = function (sequelize, DataTypes) {
  const field = getField(sequelize)

  const model = sequelize.define('quant', // 库存数量
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      quantity: {
        type: DataTypes.DECIMAL(25, 9),
        defaultValue: 0,
        validate: { min: 0 },
        allowNull: false,
        comment: '数量',
        get: toNumber
      },
      reservedQuantity: { type: DataTypes.DECIMAL(25, 9), defaultValue: 0, validate: { min: 0 }, allowNull: false, comment: '保留数量', get: toNumber },
      validQuantity: {
        type: DataTypes.VIRTUAL,
        defaultValue: 0,
        allowNull: false,
        comment: '可用数量 = 实际数量 - 保留数量',
        get: function () {
          const quantity = this.getDataValue('quantity')
          const reservedQuantity = this.getDataValue('reservedQuantity')
          return quantity - reservedQuantity
        }
      },
      info: { type: DataTypes.JSON, comment: '附加信息' }
    },
    {
      comment: '库存数量',
      indexes: [
        { fields: [field('skuId')] },
        {
          unique: true,
          fields: [field('locationId'), field('skuId')]
        }
      ]
    })

  model.associate = function (models) {
    const { sku, location } = models
    this.belongsTo(sku, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    this.belongsTo(location, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  }

  /**
   * 根据 locationId 和 skuId 获取库存，没有就创建
   * @param locationId
   * @param skuId
   * @returns {Promise<*>}
   */
  model.get = async function ({ locationId, skuId }) {
    if (!locationId) {
      throw error.err(Err.FA_INVALID_LOCATION)
    }

    if (!skuId) {
      throw error.err(Err.FA_INVALID_SKU)
    }

    const data = {
      locationId,
      skuId
    }

    const doc = await this.findOrCreate({ where: data, defaults: data })
    return doc[0]
  }

  async function getObj (idOrObj) {
    if (typeof idOrObj === 'object') return idOrObj
    return model.findByPk(idOrObj)
  }

  /**
   * 更新库存数量
   * @param idOrObj  id 或者 对象(必填)
   * @param quantity 数量(必填)
   * @returns {Promise<quant|*>}
   */
  async function updateQuantity (idOrObj, quantity = 0) {
    const id = idOrObj && idOrObj.id ? idOrObj.id : idOrObj
    logger.debug('quant.updateQuantity', { id, quantity })

    if (!id) throw error.err(Err.FA_INVALID_QUANT)

    if (!Number.isFinite(quantity)) {
      throw error.err(Err.FA_INVALID_QUANTITY)
    }

    const doc = await getObj(idOrObj)

    if (!doc) throw error.err(Err.FA_INVALID_QUANT)

    if (doc.validQuantity + quantity < 0) throw error.err(Err.FA_OUTOF_QUANT)

    await doc.increment({ quantity })

    await doc.reload()

    if (doc.validQuantity < 0) throw error.err(Err.FA_OUTOF_QUANT)

    return doc
  }

  /**
   * 入库
   * @param idOrObj  id 或者 对象(必填)
   * @param quantity 数量(必填)
   * @returns {Promise<quant|*>}
   */
  model.put = async function (idOrObj, quantity = 0) {
    if (!Number.isFinite(quantity) || quantity < 0) {
      throw error.err(Err.FA_INVALID_QUANTITY)
    }
    return updateQuantity(idOrObj, quantity)
  }

  /**
   * 出库
   * @param idOrObj  id 或者 对象(必填)
   * @param quantity 数量(必填)
   * @returns {Promise<quant|*>}
   */
  model.take = async function (idOrObj, quantity = 0) {
    if (!Number.isFinite(quantity) || quantity < 0) {
      throw error.err(Err.FA_INVALID_QUANTITY)
    }
    return updateQuantity(idOrObj, -quantity)
  }

  model.prototype.put = async function (quantity = 0) {
    return model.put(this, quantity)
  }

  model.prototype.take = async function (quantity = 0) {
    return model.take(this, quantity)
  }

  return model
}
