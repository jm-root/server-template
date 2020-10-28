const { Service, ms } = require('jm-server')
export = class extends Service {
  constructor (opts = {}, app: any) {
    super(opts)
    this.app = app
    const { modules: { orm } } = this.app
    this.orm = orm
    this.emit('ready')
  }

  /**
   * 统一载入router目录下所有路由
   * @param opts
   */
  router (opts: any) {
    const dir = `${__dirname}/../router`
    const router = this.loadRouter(dir, opts)
    // 全局引用orm定义的路由
    router.use((opts:any) => {
      return this.app.routers.orm.request(opts)
    })
    this.router = router

    // 数据库事务支持
    const routerT = ms.router()
    routerT
      .use(async (opts:any) => {
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
