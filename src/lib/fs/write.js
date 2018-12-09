const fs = require('./fs')
const mkdirp = require('./mkdirp')
const log = require('@magic/log')
const path = require('path')
const { INCLUDES_DIR }= require('../../config')

// const fileCache = {}

const write = async file => {
  const { buffer, bundle, out } = file

  // no changes, resolve
  // if (fileCache[out] && fileCache[out].buffer === buffer) {
  //   return file
  // }

  // write file to "cache"
  // fileCache[out] = file


  try {
    if (out.startsWith(INCLUDES_DIR)) {
      throw new Error(`Tried writing includes file ${out}`)
    }

    // create directory for file if it does not exist
    await mkdirp(path.dirname(out))

    // write file to disk
    const written = await fs.writeFile(out, bundle)

    log.info('writeFile', out)

    return written
  } catch(e) {
    log.error(e)
  }
}

module.exports = write