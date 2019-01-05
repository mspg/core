const http = require('http')
const path = require('path')

const fs = require('../lib/fs')
const resolveUrl = require('../lib/resolveUrl')
const log = require('@magic/log')

const conf = require('../config')

const handler = async (req, res) => {
  try {
    let filePath = await resolveUrl(req)

    const file404 = path.join(conf.OUT_DIR, '404.html')
    if (!filePath && (await fs.exists(file404))) {
      filePath = file404
    }

    if (filePath) {
      res.writeHead(200, fs.getContentType(req.url))
      const stream = fs.createReadStream(filePath)
      stream.on('open', () => stream.pipe(res))
      stream.on('error', log.error)
      return
    }
  } catch (e) {
    throw e
  }

  const response = `<!DOCTYPE html><html><head><charset="utf-8"></head><body>404 not found</body></html>`

  res.writeHead(404, { 'Content-Type': 'text/html' })
  res.end(response)
}

const serve = async () => http.createServer(handler).listen(3000)

module.exports = serve
