const xfs = require('fs')
const util = require('util')
const path = require('path')

const fs = {
  unlink: util.promisify(xfs.unlink),
  rmdir: util.promisify(xfs.rmdir),
  readdir: util.promisify(xfs.readdir),
  stat: util.promisify(xfs.stat),
  exists: util.promisify(xfs.exists),
}

const rmrf = async dir => {
  try {
    if (!dir) {
      throw new Error('rmrf: expecting a string argument.')
    }

    const exists = await fs.exists(dir)
    if (!exists) {
      return
    }

    const stat = await fs.stat(dir)
    if (stat.isFile()) {
      await fs.unlink(dir)
    } else if (stat.isDirectory()) {
      const files = await fs.readdir(dir)
      await Promise.all(files.map(async file => await rmrf(path.join(dir, file))))

      await fs.rmdir(dir)
    }
  } catch (e) {
    throw e
  }
}

module.exports = rmrf
