const { arg2bool } = require('jm-utils')
require('log4js').configure(require('./log4js'))
process.env.NODE_CONFIG_DIR = __dirname
const config = require('config')

const { orm: { config: { options: { define = {} } = {} } } = {} } = config.modules
define.underscored !== undefined && (define.underscored = arg2bool(define.underscored))

module.exports = config
