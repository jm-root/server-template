const { Service, ms } = require('jm-server')
module.exports = class extends Service {
  constructor (opts = {}, app) {
    super(opts)
    this.app = app // 服务实例

    // 引用jm-server-middleware模块中间件,快速建立数据模型实例
    const { modules: { orm } } = this.app
    this.orm = orm

    this.emit('ready')
  }

  router (opts) {
    const dir = `${__dirname}/../router`
    const router = this.loadRouter(dir, opts)
    this.router = router

    // 数据库事务支持
    const routerT = ms.router()
    routerT
      .use(opts => {
        return new Promise((resolve, reject) => {
          const { modules: { orm } } = this.app
          orm.sequelize.transaction(async () => {
            try {
              const doc = await router.request(opts)
              resolve(doc)
            } catch (e) {
              reject(e)
              throw e
            }
          })
        })
      })

    return routerT
  }
}
