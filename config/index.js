require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
process.env.NODE_CONFIG_DIR = __dirname
const config = require('config')
module.exports = config
