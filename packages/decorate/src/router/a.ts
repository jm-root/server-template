const { ms, decorators: { controller, use, add, get, post, del } } = require('jm-server')
const { validator, sequelize } = require('jm-ms-middleware')

// 装饰器定义路由
@controller
class A {
  service: any
  caches: any[] | undefined
  private model: any

  constructor (service: any) {
    this.service = service // 服务实例
    this.model = this.service.orm.sequelize.models.danwei // 引用单位数据模型
  }

  /**
   * 快速定义增删改查路由
   * 注: 该函数定义的路由将附加到当前路由最后
   */
  router () {
    const router = ms.router()
    router.use('/danweis', sequelize.resful(this.model))
    return router
  }

  /**
   * 当前全局路由
   * @param opts
   */
  @use
  async all (opts: any = {}) {
    opts.all = true
  }

  /**
   * 查询请求对象实例
   * @param opts
   */
  @get
  async opts (opts: any) {
    console.log('all = ', opts.all) // 打印上游传递字段值
    return opts
  }

  /**
   * 以add方式定义路由
   * @param opts
   */
  @add('/info/:id', 'put')
  async update (opts: any) {
    const { id } = opts.params
    return { id, data: opts.data }
  }

  /**
   * 配置路由校验中间件(validator)
   * 具体中间件schema定义,请参见:https://www.npmjs.com/package/fastest-validator
   * @param opts
   */
  @get('/info/:id', validator({
    id: { type: 'number', convert: true, positive: true }
  }))
  async id (opts: any) {
    const { id } = opts.params
    return { id, ...opts }
  }

  /**
   * post请求
   * @param opts
   */
  @post('/caches')
  async add (opts: any) {
    !this.caches && (this.caches = [])
    this.caches.push(opts.data)
    return { result: opts.data }
  }

  /**
   * get请求
   */
  @get('/caches')
  async cachesList () {
    return { rows: this.caches || [] }
  }

  /**
   * delete请求
   */
  @del('/caches')
  async remove () {
    !this.caches && (this.caches = [])
    this.caches.pop()
    return this.caches
  }

}

export = A
