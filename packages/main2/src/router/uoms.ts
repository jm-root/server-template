const { decorators: { controller, get } } = require('jm-server')
// 装饰器定义路由
@controller
class $ {
  service: any
  constructor (service: any) {
    this.service = service // 服务实例
  }

  @get('/')
  async list (opts: {}) {
    console.log(opts)
  }
}

export = $
