const { ms } = require('jm-server')
const { validator } = require('jm-ms-middleware')

module.exports = function (service) {
  const router = ms.router()
  router
    /**
     * 查询列表
     * @param {object} opts 请求选项
     * @param {object} opts.data 请求数据
     * @param {string} [opts.data.page=1] 第几页
     * @param {string} [opts.data.rows=10] 一页几行
     * @param {string} [opts.data.offset] 偏移值
     * @param {string} [opts.data.limit] 个数
     * @param {string} [opts.data.o] 排序,如:o=moditime desc,crtime asc
     * @param {string} [opts.data.f] 字段选择,如:f=id,code,name
     * @param {string} [opts.data.s] 模糊搜索,如:s=公司
     * @returns {Promise<({rows: []}|{page: number, pages: number, total: number, rows: []})|*>}
     * @example
     * 例1: http://localhost:3000/main/danweis?page=1&s=公司&f=id,nId,code,name,crtime&o=crtime%20desc
     * 例2: http://localhost:3000/main/danweis?offset=0&limit=2
     * 例3: http://localhost:3000/main/danweis?nId[gt]=1&nId[lte]=3
     * 例4: http://localhost:3000/main/danweis?page=1&nId[or][in]=3&nId[or][in]=4&nId[or][and][gt]=7&nId[or][and][lt]=10
     */
    .add('/danweis', 'get', validator({
      page: { type: 'number', convert: true, positive: true, optional: true },
      rows: { type: 'number', convert: true, positive: true, optional: true },
      offset: { type: 'number', min: 0, convert: true, optional: true },
      limit: { type: 'number', convert: true, positive: true, optional: true },
      o: { type: 'string', min: 1, max: 50, optional: true },
      f: { type: 'string', min: 1, max: 50, optional: true },
      s: { type: 'string', min: 1, max: 50, optional: true }
    }), opts => {
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
