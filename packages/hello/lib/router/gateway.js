const MS = require('jm-ms-core')
const ms = new MS()

module.exports = function (service) {
  const { gateway } = service
  gateway.bind('config')

  const router = ms.router()
  router.add('/', 'get', async opts => {
    const doc = await gateway.get('/')
    doc.modules.config = await gateway.config.get('/')
    return doc
  })
  return router
}
