const MS = require('jm-ms')
const ms = new MS()

module.exports = function ({ gateway }) {
  const client = ms.client({ uri: gateway })

  /**
   * 建立服务访问绑定
   * @param {string} name 服务名
   * @param {string} uri 访问路径
   * @returns {client}
   */
  client.bind = function (name, uri) {
    uri || (uri = `/${name}`)
    uri.indexOf('://') === -1 && (uri = gateway + uri)
    this[name] = ms.client({ uri })
    return this
  }

  return client
}
