const event = require('jm-event')
class Service {
  constructor () {
    event.enableEvent(this, { sync: true })
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

$.on('open', () => {
  s.emit('ready')
})

let orm = null
let main = null

beforeAll(async () => {
  await s.onReady()
  orm = $.modules.orm
  main = $.modules.main
  await orm.onReady()
  await main.onReady()
})

afterAll(async () => {
  $.close()
})

describe('server', async () => {
  test('orm', async () => {
    const { sequelize: { models: { dict: model } } } = orm
    const doc = await model.findAll()
    console.log(doc)
  }, 6000 * 1000)

  test('router', async () => {
    const { root: router } = $
    const doc = await router.get('/')
    console.log(doc)
  }, 6000 * 1000)
})
