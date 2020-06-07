const { ms } = require('jm-server')

module.exports = function () {
  const router = ms.router()
  router.add('/', 'get', opts => {
    return { hello: 'sub world', ...opts }
  })
  return router
}
