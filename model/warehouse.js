const { enableIndividualHooks, getField } = require('./utils')

module.exports = function (sequelize, DataTypes) {
  const field = getField(sequelize)

  const model = sequelize.define('warehouse', // 仓库
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      orgId: { type: DataTypes.UUID, defaultValue: '', allowNull: false, comment: '所属组织id' },
      name: { type: DataTypes.STRING(20), allowNull: false, comment: '名称' },
      code: { type: DataTypes.STRING(5), comment: '代码，名称缩写' },
      status: { type: DataTypes.TINYINT(1), defaultValue: 1, validate: { min: 0, max: 1 }, comment: '状态(0:无效,1:有效)' },
      info: { type: DataTypes.JSON, comment: '附加信息' }
    },
    {
      comment: '仓库',
      indexes: [
        {
          fields: ['code']
        },
        {
          fields: ['name']
        },
        {
          unique: true,
          fields: [field('orgId'), 'code']
        },
        {
          unique: true,
          fields: [field('orgId'), 'name']
        }
      ]
    })

  model.associate = function (models) {
    const { location } = models
    this.belongsTo(location, { comment: '默认库位, 仓库内部库位', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  }

  enableIndividualHooks(model)

  model.addHook('beforeCreate', async function (item) {
    const { name, orgId } = item
    const doc = await sequelize.models.location.create({ name, orgId })
    item.locationId = doc.id
  })

  model.addHook('afterDestroy', async function (item) {
    const doc = await item.getLocation()
    await doc.destroy()
  })

  return model
}
