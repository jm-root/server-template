const { getField } = require('./utils')

module.exports = function (sequelize, DataTypes) {
  const field = getField(sequelize)

  const model = sequelize.define('location', // 库位
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      orgId: { type: DataTypes.UUID, comment: '所属组织id' },
      path: { type: DataTypes.STRING(255), comment: '关系路径' },
      depth: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 0, validate: { min: 0 }, comment: '关系深度' },
      name: { type: DataTypes.STRING(50), allowNull: false, comment: '名称' },
      status: { type: DataTypes.TINYINT(1), defaultValue: 1, validate: { min: 0, max: 1 }, comment: '状态(0:无效,1:有效)' },
      info: { type: DataTypes.JSON, comment: '附加信息' }
    },
    {
      comment: '库位',
      indexes: [
        { fields: ['name'] },
        { fields: [field('orgId')] }
      ]
    })

  model.associate = function (models) {
    const { warehouse, quant, move } = models
    this.belongsTo(this, { as: 'parent', comment: '父级库位id', onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
    this.hasMany(this, { as: 'children', foreignKey: 'parentId', constraints: false })
    this.hasOne(warehouse, { constraints: false })
    this.hasMany(quant, { constraints: false })
    this.hasMany(move, { as: 'moveIns', foreignKey: 'toLocationId', constraints: false })
    this.hasMany(move, { as: 'moveOuts', foreignKey: 'fromLocationId', constraints: false })
  }

  model.addHook('beforeValidate', async function (item) {
    const { parentId } = item
    if (parentId) {
      const doc = await model.findByPk(parentId)
      if (!doc) throw new Error('父库位不存在')
      item.parent = doc
    }
  })

  // 计算父级关系 path 和 depth
  function changeRelation (item) {
    const { parent } = item

    item.path = `/${item.id}`
    if (parent) {
      const doc = parent
      item.path = `${doc.path}/${item.id}`
      item.depth = doc.depth + 1
    }
  }

  model.addHook('afterCreate', async item => {
    changeRelation(item)
    await item.save({ fields: ['path', 'depth'] })
  })

  return model
}
