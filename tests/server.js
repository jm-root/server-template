const config = require('../config/index')
const { Server } = require('jm-server')
const server = new Server(config)
module.exports = server
