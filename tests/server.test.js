const s = require('./service')
const { $ } = s

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
