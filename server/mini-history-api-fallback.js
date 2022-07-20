module.exports = function historyApiFallback(options = {}) {
  return function (req, res, next) {
    const headers = req.headers
    if (
      req.method !== 'GET' || // 非get资源，如post接口
      !headers ||
      typeof headers.accept !== 'string' || // 非string资源，如media
      headers.accept.indexOf('application/json') === 0 || // 一般为rest接口
      !['text/html', '*/*'].find((header) => headers.accept.indexOf(header) !== -1) || // 确定非html头
      req.url.lastIndexOf('.') > req.url.lastIndexOf('/') // 静态资源的.位置大于/的位置（确定是否是静态资源）
    ) {
      options.verbose && console.log('No Rewriting', req.method, req.url, 'to', req.url)
      return next()
    }

    options.verbose && console.log('Rewriting', req.method, req.url, 'to', '/index.html')
    // 判断直接读取文件 .xx（好像没什么必要, 先取消）
    req.url = '/index.html'
    next()
  }
}
