'use strict'
module.exports = class extends require('jm-server').Service {
  constructor (opts = {}, app) {
    super(opts)
    this.app = app
    this.emit('ready')
  }

  router (opts) {
    const dir = `${__dirname}/../router`
    return this.loadRouter(dir, opts)
  }
}
