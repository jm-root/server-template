const error = require('jm-err')
const { Err } = require('consts')
const { enableIndividualHooks } = require('./utils')

module.exports = function (sequelize, DataTypes) {
  const model = sequelize.define('sku', // stock keeping unit 库存量单位
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(50), allowNull: false, comment: '名称' },
      status: { type: DataTypes.TINYINT(1), defaultValue: 1, validate: { min: 0, max: 1 }, comment: '状态(0:无效,1:有效)' },
      info: { type: DataTypes.JSON, comment: '附加信息' },
      spuId: { type: DataTypes.UUID }
    },
    {
      comment: '库存产品',
      indexes: [
        { fields: ['name'] }
      ]
    })

  model.associate = function (models) {
    const { spu, quant, move } = models
    this.belongsTo(spu, { foreignKey: { allowNull: false }, onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
    this.hasMany(quant, { constraints: false })
    this.hasMany(move, { constraints: false })
  }

  enableIndividualHooks(model, 'beforeBulkCreate')

  model.addHook('beforeCreate', async function (record) {
    const spu = await record.getSpu()
    if (!spu) throw error.err(Err.FA_INVALID_SPU)
  })

  model.prototype.getUom = async function () {
    const spu = await this.getSpu()
    return spu.getUom()
  }

  return model
}
