const path = require('path')

const log = require('@magic/log')

const fs = require('./fs')
const mkdirp = require('./mkdirp')

const fileCache = {}

const write = async file => {
  const { buffer, bundle, out } = file

  // no changes, resolve
  if (fileCache[out] && fileCache[out].buffer.toString() === buffer.toString()) {
    return file
  }

  // write file to "cache"
  fileCache[out] = file

  try {
    // create directory for file if it does not exist
    await mkdirp(path.dirname(out))

    // write file to disk
    const written = await fs.writeFile(out, bundle)

    log.info('writeFile', out)

    return written
  } catch (e) {
    log.error(e)
  }
}

module.exports = write
