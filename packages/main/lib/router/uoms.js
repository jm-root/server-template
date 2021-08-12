const { ms } = require('jm-server')

// 类方式定义路由
module.exports = class {
  /**
   * 构造
   * @param {object} service 服务实例
   */
  constructor (service) {
    this.config = service.app.config
  }

  async beforeList () {
    console.log('before list')
  }

  router () {
    const router = ms.router()
    router.add('/', 'get', this.beforeList)
    return router
  }
}
