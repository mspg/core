import http from 'http'
import path from 'path'
import { createReadStream } from 'fs'

import fs from '@magic/fs'
import resolveUrl from '../lib/resolveUrl.js'
import log from '@magic/log'

const handler = conf => async (req, res) => {
  try {
    let filePath = await resolveUrl(req, conf)

    const file404 = path.join(conf.OUT_DIR, '404.html')
    if (!filePath && (await fs.exists(file404))) {
      filePath = file404
    }

    if (filePath) {
      res.writeHead(200, fs.getContentType(req.url))
      const stream = createReadStream(filePath)
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

export const serve = async conf => http.createServer(handler(conf)).listen(3000)

export default serve
