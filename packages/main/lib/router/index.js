const { ms } = require('jm-server')

module.exports = function (service) {
  const router = ms.router()
  router
    .add('/danweis', 'get', opts => {
      const { models } = service.app.modules.orm.sequelize
      opts.include || (opts.include = [
        { model: models.danwei, as: 'govern', attributes: ['code', 'name'] },
        { model: models.region, as: 'region', attributes: ['name'] }
      ])
    })
    .use(opts => {
      return service.app.routers.orm.request(opts)
    })
  return router
}
