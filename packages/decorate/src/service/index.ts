export = class extends require('jm-server').Service {
  constructor (opts = {}, app: any) {
    super(opts)
    this.app = app
    this.emit('ready')
  }

  router (opts: any) {
    const dir = `${__dirname}/../router`
    return this.loadRouter(dir, opts)
  }
}
