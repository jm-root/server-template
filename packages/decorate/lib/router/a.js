'use strict'
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length; var r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc; var d
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function') r = Reflect.decorate(decorators, target, key, desc)
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
  return c > 3 && r && Object.defineProperty(target, key, r), r
}
const { ms, decorators: { controller, use, add, get, post, del } } = require('jm-server')
const { validator, sequelize } = require('jm-ms-middleware')
// 装饰器定义路由
let A = class A {
  constructor (service) {
    this.service = service // 服务实例
    this.model = this.service.orm.sequelize.models.uom // 引用单位数据模型
  }

  /**
     * 快速定义增删改查路由
     * 注: 该函数定义的路由将附加到当前路由最后
     */
  router () {
    const router = ms.router()
    router.use('/uoms', sequelize.resful(this.model))
    return router
  }

  /**
     * 当前全局路由
     * @param opts
     */
  async all (opts = {}) {
    opts.all = true
  }

  /**
     * 查询请求对象实例
     * @param opts
     */
  async opts (opts) {
    console.log('all = ', opts.all) // 打印上游传递字段值
    return opts
  }

  /**
     * 以add方式定义路由
     * @param opts
     */
  async update (opts) {
    const { id } = opts.params
    return { id, data: opts.data }
  }

  /**
     * 配置路由校验中间件(validator)
     * 具体中间件schema定义,请参见:https://www.npmjs.com/package/fastest-validator
     * @param opts
     */
  async id (opts) {
    const { id } = opts.params
    return { id, ...opts }
  }

  /**
     * post请求
     * @param opts
     */
  async add (opts) {
    !this.caches && (this.caches = [])
    this.caches.push(opts.data)
    return { result: opts.data }
  }

  /**
     * get请求
     */
  async cachesList () {
    return { rows: this.caches || [] }
  }

  /**
     * delete请求
     */
  async remove () {
    !this.caches && (this.caches = [])
    this.caches.pop()
    return this.caches
  }
}
__decorate([
  use
], A.prototype, 'all', null)
__decorate([
  get
], A.prototype, 'opts', null)
__decorate([
  add('/info/:id', 'put')
], A.prototype, 'update', null)
__decorate([
  get('/info/:id', validator({
    id: { type: 'number', convert: true, positive: true }
  }))
], A.prototype, 'id', null)
__decorate([
  post('/caches')
], A.prototype, 'add', null)
__decorate([
  get('/caches')
], A.prototype, 'cachesList', null)
__decorate([
  del('/caches')
], A.prototype, 'remove', null)
A = __decorate([
  controller
], A)
module.exports = A
