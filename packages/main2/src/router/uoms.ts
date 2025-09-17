import { decorators} from 'jm-server'
const { controller, get } = decorators

// 装饰器定义路由
@controller
class $ {
  service: any
  constructor (service: any) {
    this.service = service // 服务实例
  }

  @get('/')
  async list (opts: any = {}) {
    console.log(opts)
  }
}

export = $
