'use strict'
module.exports = class extends require('jm-server').Service {
  constructor (opts = {}, app) {
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
  router (opts) {
    const dir = `${__dirname}/../router`
    return this.loadRouter(dir, opts)
  }
}
