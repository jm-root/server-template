const error = require('jm-err')
const { Err } = require('consts')
const log = require('jm-log4js')
const logger = log.getLogger('wms')
const { toNumber, enableIndividualHooks, getField } = require('./utils')

module.exports = function (sequelize, DataTypes) {
  const field = getField(sequelize)

  const model = sequelize.define('move', // 库存移动
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      orderId: { type: DataTypes.UUID, comment: '所属出入库单id' },
      type: { type: DataTypes.TINYINT(1), defaultValue: 0, comment: '移动类型 例如采购、拆箱、报废、借出等' },
      quantity: {
        type: DataTypes.DECIMAL(25, 9),
        defaultValue: 0,
        allowNull: false,
        validate: { min: 0 },
        comment: '数量',
        get: toNumber
      },
      uomQuantity: {
        type: DataTypes.DECIMAL(25, 9),
        defaultValue: 0,
        allowNull: false,
        validate: { min: 0 },
        comment: '计量单位数量',
        get: toNumber
      },
      info: { type: DataTypes.JSON, comment: '附加信息' }
    },
    {
      comment: '库存移动',
      indexes: [
        { fields: [field('orderId')] }
      ]
    })

  model.associate = function (models) {
    const { sku, location, uom } = models
    this.belongsTo(sku, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    this.belongsTo(location, { as: 'fromLocation', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    this.belongsTo(location, { as: 'toLocation', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    this.belongsTo(uom, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  }

  enableIndividualHooks(model, 'beforeBulkCreate')

  model.addHook('beforeCreate', async function (item) {
    logger.debug('move', item)
    const { models } = sequelize
    const { fromLocationId, toLocationId, skuId, uomId } = item
    let { quantity, uomQuantity } = item
    uomQuantity = uomQuantity || quantity

    if (!skuId) throw error.err(Err.FA_INVALID_SKU)
    if (!uomQuantity) throw error.err(Err.FA_INVALID_QUANTITY)
    if (!fromLocationId && !toLocationId) throw new Error('fromLocationId和toLocationId不能同时为空')
    if (fromLocationId === toLocationId) throw error.err(Err.FA_SELF_MOVE)
    const uom = await item.getUom()
    if (!uom) throw new Error('uomId不存在')
    const _sku = await item.getSku()
    if (!_sku) throw new Error('skuId不存在')
    quantity = uom.ratio * item.uomQuantity // 移库数量换算成基准单位的数量
    item.quantity = quantity
    let fromQuant = null // 出库方
    let fromQuantUomQuantity = item.uomQuantity // 按照出库方uom计算的数量.假设uom相同,出库数量无需换算.
    if (item.fromLocationId) {
      fromQuant = await models.quant.get({ locationId: item.fromLocationId, skuId: item.skuId })
      const fromSku = await fromQuant.getSku()
      const fromUom = await fromSku.getUom()
      if (fromUom.id !== uomId) { // uom不同,需要换算
        fromQuantUomQuantity = quantity / fromUom.ratio // 换算成按照出库方uom计算的数量
      }
    }

    let toQuant = null // 入库方
    let toQuantUomQuantity = item.uomQuantity // 按照入库方uom计算的数量.假设uom相同,入库数量无需换算.
    if (item.toLocationId) {
      const toLocation = await item.getToLocation()
      if (!toLocation) throw new Error(`转入库位不存在：id=${item.toLocationId}`)
      toQuant = await models.quant.get({ locationId: toLocation.id, skuId: item.skuId }) // find
      const toSku = await toQuant.getSku()
      const toUom = await toSku.getUom()
      if (toUom.id !== uomId) { // uom不同,需要换算
        toQuantUomQuantity = quantity / toUom.ratio // 换算成按照入库方uom计算的数量
      }
    }

    if (fromQuant) {
      await fromQuant.take(fromQuantUomQuantity) // 核减出库方库存
    }
    if (toQuant) {
      await toQuant.put(toQuantUomQuantity) // 核加入库方库存
    }
  })
  return model
}
