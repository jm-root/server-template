const {ms} = require('jm-server')

// 函数方式定义路由
export = function(){
  const router = ms.router()
  router.use((opts: any)=>opts)
  return router
}
