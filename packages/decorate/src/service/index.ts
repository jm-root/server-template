export = class extends require('jm-server').Service {
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
    return this.loadRouter(dir, opts)
  }
}
