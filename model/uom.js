const { toNumber } = require('./utils')

module.exports = function (sequelize, DataTypes) {
  const model = sequelize.define('uom', // 计量单位
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(20), allowNull: false, comment: '名称' },
      category: { type: DataTypes.TINYINT(1), defaultValue: 0, validate: { min: 0 }, comment: '分类 例如 1数量 2重量 3时间 4长度 5体积' },
      type: { type: DataTypes.TINYINT(1), defaultValue: 0, validate: { min: 0, max: 1 }, comment: '类型 0 普通单位 1 基准单位' },
      ratio: {
        type: DataTypes.DECIMAL(25, 9),
        defaultValue: 1,
        allowNull: false,
        comment: '比率，表示1个本单位=ratio个基准单位',
        get: toNumber
      },
      precision: { type: DataTypes.DECIMAL(25, 9), defaultValue: 0.01, comment: '精确度', get: toNumber },
      status: { type: DataTypes.TINYINT(1), defaultValue: 1, validate: { min: 0, max: 1 }, comment: '状态(0:无效,1:有效)' },
      info: { type: DataTypes.JSON, comment: '附加信息' }
    },
    {
      comment: '计量单位',
      indexes: [
        { fields: ['name'] },
        {
          unique: true,
          fields: ['category', 'name']
        }
      ]
    })
  model.associate = function (models) {
    const { spu, move } = models
    this.hasMany(spu, { constraints: false })
    this.hasMany(move, { constraints: false })
  }
  model.addHook('beforeCreate', async function (record) {
    if (record.type === 0 && (await model.findAll({ where: { category: record.category, type: 1 } })).length < 1) throw new Error('需要先创建基准单位。')
    if (record.type === 1 && (await model.findAll({ where: { category: record.category, type: 1 } })).length > 0) throw new Error('该类别已经有基准单位，每个分类只允许由一个基准单位')
  })
  model.addHook('beforeUpdate', async function (record) {
    if (record.changed('type')) throw new Error('不能修改计量单位的类别(type)')
  })
  model.addHook('afterValidate', async function (record) {
    if (record.type === 1 && record.ratio !== 1) throw new Error('基准单位的比率(ratio)必须为1')
  })
  model.addHook('beforeDestroy', async function (record) {
    if (await record.inUse()) throw new Error('该计量单位正在使用，禁止删除。如果需要删除本单位，请删除使用该单位的Spu、Move、该类别的所有标准单位。')
  })

  const enableIndividualHooks = function (options) {
    options.individualHooks = true
    return options
  }
  model.addHook('beforeBulkDestroy', enableIndividualHooks)
  model.addHook('beforeBulkCreate', enableIndividualHooks)
  model.addHook('beforeBulkUpdate', enableIndividualHooks)

  model.prototype.inUse = async function () {
    if (await this.countSpus()) return true
    if (await this.countMoves()) return true
    const { type, category } = this
    if (type === 1) {
      const doc = await model.findOne({ attributes: ['id'], where: { category, type: 0 } })
      if (doc) return true
    }
    return false
  }

  model.prototype.getBasicUom = async function () {
    switch (this.type) {
      case 1:
        return this
      case 0:
        return (await model.findOne({ where: { category: this.category, type: 1 } }))
    }
  }
  return model
}
