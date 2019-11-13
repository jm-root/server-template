const log = require('jm-log4js')
const event = require('jm-event')
const MS = require('jm-ms')
const t = require('locale')

const logger = log.getLogger('main')
const ms = new MS()

class Service {
  constructor (opts = {}) {
    const { gateway, debug, app } = opts
    debug && (logger.setLevel('debug'))

    event.enableEvent(this, { sync: true })
    Object.assign(this, { app, logger, t, gateway })

    this.onReady()
  }

  async onReady () {
    if (this.ready) return
    return new Promise(resolve => {
      this.once('ready', () => {
        this.ready = true
        resolve()
      })
    })
  }

  async bind (name, uri) {
    uri || (uri = `/${name}`)
    uri.indexOf('http') !== 0 && (uri = this.gateway + uri)
    let doc = await ms.client({ uri })
    this[name] = doc
    return doc
  }
}

module.exports = Service
