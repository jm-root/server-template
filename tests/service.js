const event = require('jm-event')
class Service {
  constructor () {
    event.enableEvent(this, { async: true })
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
}

const s = new Service()
const $ = require('./server')

$
  .on('open', () => {
    s.emit('ready')
  })
  .on('close', () => {
    $.modules.orm.sequelize.close()
  })

s.$ = $

module.exports = s
