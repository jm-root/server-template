'use strict'
const { ms } = require('jm-server')
module.exports = function () {
  const router = ms.router()
  router.use((opts) => opts)
  return router
}
