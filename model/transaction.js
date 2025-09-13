
module.exports = function (sequelize, DataTypes) {
  const model = sequelize.define('transaction', // 事务，用于处理分布式事务状态，按最终一致性原则
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

      code: { type: DataTypes.STRING(50), unique: true, comment: '事务编号，用于唯一标识此事务，保证幂等性' },

      status: { type: DataTypes.TINYINT(1), defaultValue: 0, comment: '状态 0 未完成 1 已完成 2 手工结束' },

      step: { type: DataTypes.TINYINT(1), defaultValue: 0, comment: '当前步骤 0 未开始 1 第一步已完成 2 第二步已完成 以此类推' },

      info: { type: DataTypes.JSON, comment: '附加信息' }
    },
    {
      comment: '事务'
    })

  return model
}
