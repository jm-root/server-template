const inflection = require('inflection')

function getField (sequelize) {
  const { options: { define: { underscored } = {} } = {} } = sequelize
  return function (name) {
    if (underscored) return inflection.underscore(name)
    return name
  }
}

// 字段转换为数字类型显示
function toNumber (name) {
  return Number(this.getDataValue(name))
}

function individualHook (...args) {
  args[args.length - 1].individualHooks = true
}

function enableIndividualHooks (model, ...hookEvents) {
  hookEvents.length || (hookEvents = ['beforeBulkCreate', 'beforeBulkUpdate', 'beforeBulkDestroy'])
  hookEvents.forEach(key => {
    model.addHook(key, individualHook)
  })
}

module.exports = {
  getField,
  toNumber,
  enableIndividualHooks
}
