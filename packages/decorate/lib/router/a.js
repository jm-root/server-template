'use strict'
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length; var r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc; var d
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function') r = Reflect.decorate(decorators, target, key, desc)
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
  return c > 3 && r && Object.defineProperty(target, key, r), r
}
const { decorators: { controller, use, add, get, post, delete: remove } } = require('jm-server')
// 装饰器定义路由
let A = class A {
  constructor (service) {
    this.service = service
  }

  async all (opts = {}) {
    opts.all = true
  }

  async opts (opts) {
    return opts
  }

  async add (opts) {
    !this.caches && (this.caches = [])
    this.caches.push(opts.data)
    return { result: opts.data }
  }

  async cachesList () {
    return { rows: this.caches || [] }
  }

  async update (opts) {
    const { id } = opts.params
    return { id, type: opts.type, data: opts.data }
  }

  async id (opts) {
    const { id } = opts.params
    return { id, ...opts }
  }

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
  post
], A.prototype, 'add', null)
__decorate([
  get('/caches')
], A.prototype, 'cachesList', null)
__decorate([
  add('/:id', 'put')
], A.prototype, 'update', null)
__decorate([
  get('/:id')
], A.prototype, 'id', null)
__decorate([
  remove
], A.prototype, 'remove', null)
A = __decorate([
  controller
], A)
module.exports = A
