const express = require('express')
// const { createProxyMiddleware } = require('http-proxy-middleware')
const history = require('./mini-history-api-fallback')
const compression = require('compression')

const app = express()
app.use(history())
app.use(compression())

app.use((req, res, next) => {
  // 将 index.html 设为 no-cache
  if (req.url == '/index.html') {
    res.setHeader('Cache-control', 'no-cache')
  }
  next()
})
app.use(
  express.static('dist', {
    etag: false,
    maxAge: 2592000 * 1000
  })
)

// const url = process.env.CONFIG_URL || 'http://172.31.27.97:7000'
// const proxy = process.env.CONFIG_PROXY || '/api'

// /** @type {import('http-proxy-middleware/dist/types').Options} */
// const options = {
//   target: url,
//   changeOrigin: true,
//   pathRewrite: {
//     [`^${proxy}`]: ''
//   }
// }
// app.use(proxy, createProxyMiddleware(options))

const WebPort = process.env.WEB_PORT || '5137'
app.listen(WebPort, () => {
  console.log('Listening on: http://localhost:' + WebPort)
})
