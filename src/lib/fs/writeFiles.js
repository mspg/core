const fs = require('./fs')
const log = require('@magic/log')

const write = async file => {
  const { buffer, bundle, out } = file

  // no changes, resolve
  if (fileCache[out]) {
    if (fileCache[out].buffer.toString() === buffer.toString()) {
      return file
    }
  }

  // write file to "cache"
  fileCache[out] = file

  // create directory for file if it does not exist
  await fs.mkdirp(path.dirname(out))

  // write file to disk
  const written = await fs.writeFile(out, bundle)

  log.info('writeFile', out)

  return written
}