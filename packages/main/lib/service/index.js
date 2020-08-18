const { Service, ms } = require('jm-server')
module.exports = class extends Service {
  constructor (opts = {}, app) {
    super(opts)
    this.app = app // server实例

    // 引用jm-server-middleware模块中间件,快速建立数据模型实例
    const { modules: { orm } } = this.app
    this.orm = orm

    this.emit('ready')
  }

  router (opts) {
    const dir = `${__dirname}/../router`
    const router = this.loadRouter(dir, opts)
    // 全局引用orm定义的路由
    router.use(opts => {
      return this.app.routers.orm.request(opts)
    })
    this.router = router

    // 数据库事务支持
    const routerT = ms.router()
    routerT
      .use(async opts => {
        const { modules: { orm } } = this.app
        try {
          const doc = await orm.sequelize.transaction(async () => {
            return router.request(opts)
          })
          return doc
        } catch (e) {
          let err = e
          if (e.message === 'Validation error' && Array.isArray(e.errors)) {
            const item = e.errors[0]
            err = new Error(item.message || e.message)
          }
          throw err
        }
      })

    return routerT
  }
}
