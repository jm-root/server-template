const { ms } = require('jm-server')
const { validator } = require('jm-ms-middleware')

// 类方式定义路由
class router {
  /**
   * 构造
   * @param {object} service 服务实例
   */
  constructor (service) {
    this.config = service.app.config
  }

  async beforeList (opts) {
    return { info: 'class router list', ...opts }
  }

  async beforeGet (opts) {
    const { id } = opts.params
    return { info: `class router get ${id}`, ...opts }
  }

  router () {
    const router = ms.router()
    router.add('/', 'get', this.beforeList)
    router.add('/:id', 'get', validator({
      id: { type: 'number', convert: true, positive: true, optional: true }
    }), this.beforeGet)
    return router
  }
}

module.exports = router
