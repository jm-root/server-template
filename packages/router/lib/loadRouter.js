const path = require('path')
const fs = require('fs')
const MS = require('jm-ms-core')
const log = require('jm-log4js')

const logger = log.getLogger('main')
const ms = new MS()

function loadRouter (service, dir) {
  const router = ms.router()
  fs
    .readdirSync(dir)
    .filter(function (file) {
      return (file.indexOf('.js') !== 0)
    })
    .forEach(file => {
      const key = path.basename(file, '.js')
      let prefix = `/${key}`
      file === 'index.js' && (prefix = '/')
      if (fs.statSync(`${dir}/${file}`).isDirectory()) {
        logger.debug(`load router dir ${prefix} ...`)
        router.use(prefix, loadRouter(service, `${dir}/${file}`))
        logger.debug(`load router dir ${prefix} ...ok`)
        return
      }
      const r = require(`${dir}/${key}`)(service)
      r.prefix && (prefix = r.prefix)
      router.use(prefix, r)
      logger.debug(`load router ${prefix}`)
    })
  return router
}

module.exports = loadRouter
