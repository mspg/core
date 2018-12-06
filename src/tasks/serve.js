const util = require('util')
const fs = require('../lib/fs')
const path = require('path')

const conf = require('../config')

const http = require('http')

const resolveUrl = async req => {
  const file = path.join(conf.OUT_DIR, req.url)

  if (path.resolve(file) === path.resolve(conf.OUT_DIR)) {
    //index.html is the default resolve for /
    return path.join(conf.OUT_DIR, 'index.html')
  }

  try {
    // file exists
    if (await fs.exists(file)) {
      return file
    }

    // file exists as html, /about loads /about.html
    if (await fs.exists(`${file}.html`)) {
      return `${file}.html`
    }

    // file exists as index.html and file is a directory.
    const f = path.join(file, 'index.html')
    if (await fs.exists(f)) {
      return f
    }
  } catch (e) {
    throw e
  }

  return false
}

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
      stream.on('error', err => res.end(err.toString()))
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
