const util = require('util')
const path = require('path')
const xfs = require('fs')
const _0777 = parseInt('0777', 8)

const fs = {
  mkdir: util.promisify(xfs.mkdir),
  stat: util.promisify(xfs.stat),
}

const mkdirP = async (p, made) => {
  const mode = _0777 & ~process.umask()

  if (!made) {
    made = null
  }

  p = path.resolve(p)

  let err

  try {
    await fs.mkdir(p, mode)
    made = made || p
  } catch (err0) {
    if (err0.code === 'ENOENT') {
      made = await mkdirP(path.dirname(p), made)
      await mkdirP(p, made)
    } else if (err0.code === 'EEXIST') {
      err = null
    } else {
      err = err0
    }
  }

  try {
    const stat = await fs.stat(p)
    if (!stat.isDirectory()) {
      throw err
    }
  } catch (err1) {
    if (err) {
      throw err
    } else {
      throw err1
    }
  }
  return made
}

module.exports = mkdirP
