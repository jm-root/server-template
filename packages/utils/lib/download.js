const http = require('http')
const https = require('https')
const { URL } = require('url')

/**
 * 根据资源地址下载资源
 * @param {string} url 资源地址
 * @returns {Promise<unknown>}
 */
async function download (url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    let agent = http
    if (u.protocol === 'https:') agent = https
    agent.get(url, res => {
      const chunks = []
      let size = 0
      res.on('data', chunk => {
        chunks.push(chunk)
        size += chunk.length
      })
      res.on('end', err => {
        if (err) return reject(err)
        const data = Buffer.concat(chunks, size)
        resolve(data)
      })
    })
  })
}

/**
 * 根据资源地址下载资源
 * @param {string} url 资源地址
 * @returns {Promise<string>} 经base64转化后数据
 */
async function downloadBase64 (url) {
  const data = await download(url)
  return data.toString('base64')
}

module.exports = { download, downloadBase64 }
