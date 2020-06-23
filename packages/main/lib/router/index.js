const { ms } = require('jm-server')

module.exports = function () {
  const router = ms.router()
  router
    .use(opts => {
      console.log('all', opts)
    })
  return router
}
