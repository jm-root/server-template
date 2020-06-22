const { decorators: { controller, use, add, get, post, delete: remove } } = require('jm-server')

// 装饰器定义路由
@controller
class A {
  service: any
  caches: any[] | undefined

  constructor (service: any) {
    this.service = service
  }

  @use
  async all (opts: any = {}) {
    opts.all = true
  }

  @get
  async opts (opts: any) {
    return opts
  }

  @post
  async add (opts: any) {
    !this.caches && (this.caches = [])
    this.caches.push(opts.data)
    return { result: opts.data }
  }

  @get('/caches')
  async cachesList () {
    return { rows: this.caches || [] }
  }

  @add('/:id', 'put')
  async update (opts: any) {
    const { id } = opts.params
    return { id, type: opts.type, data: opts.data }
  }

  @get('/:id')
  async id (opts: any) {
    const { id } = opts.params
    return { id, ...opts }
  }

  @remove
  async remove () {
    !this.caches && (this.caches = [])
    this.caches.pop()
    return this.caches
  }

}

export = A
