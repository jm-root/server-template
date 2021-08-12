const { getField } = require('./utils')

module.exports = function (sequelize, DataTypes) {
  const field = getField(sequelize)

  const model = sequelize.define('spu', // standard product unit  标准产品单位
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      orgId: { type: DataTypes.UUID, comment: '所属组织id' },
      name: { type: DataTypes.STRING(50), allowNull: false, comment: '名称' },
      status: { type: DataTypes.TINYINT(1), defaultValue: 1, validate: { min: 0, max: 1 }, comment: '状态(0:无效,1:有效)' },
      info: { type: DataTypes.JSON, comment: '附加信息' }
    },
    {
      comment: '标准产品, 产品模板',
      indexes: [
        { fields: ['name'] },
        {
          unique: true,
          fields: [field('orgId'), 'name']
        }
      ]
    })

  model.associate = function (models) {
    const { sku, uom } = models
    this.hasMany(sku, { constraints: false })
    this.belongsTo(uom, { foreignKey: { allowNull: false }, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  }
  const enableIndividualHooks = function (options) {
    options.individualHooks = true
    return options
  }
  model.addHook('beforeBulkDestroy', enableIndividualHooks)
  model.addHook('afterBulkCreate', enableIndividualHooks)
  model.addHook('beforeBulkCreate', enableIndividualHooks)

  model.addHook('afterValidate', async function (record) {
    const uom = await record.getUom()
    if (!uom) throw new Error('该uomId不存在。')
  })
  model.addHook('afterCreate', async function (item) {
    const { name } = item
    await item.createSku({
      name
    })
  })

  return model
}
