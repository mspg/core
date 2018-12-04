const path = require('path')

const log = require('@magic/log')

const fs = require('./fs')
const mkdirp = require('./mkdirp')

const fileCache = {}

const write = async file => {
  const { buffer, bundle, out } = file

  // no changes, resolve
  if (fileCache[out]) {
    if (fileCache[out].buffer === buffer) {
      return file
    }
  }

  // write file to "cache"
  fileCache[out] = file

  // create directory for file if it does not exist
  await mkdirp(path.dirname(out))

  // write file to disk
  const written = await fs.writeFile(out, bundle)

  log.info('writeFile', out)

  return written
}

module.exports = write
