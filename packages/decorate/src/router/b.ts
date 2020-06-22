const {ms} = require('jm-server')

// 类方式定义路由
class B {
  router(){
    const router = ms.router()
    router.use((opts: any)=>opts)
    return router
  }
}

export = B
