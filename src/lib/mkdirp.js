const util = require('util')
const path = require('path')
const xfs = require('fs')
const _0777 = parseInt('0777', 8)

const fs = {
  mkdir: util.promisify(xfs.mkdir),
  stat: util.promisify(xfs.stat),
}

const mkdirP = async (p, made) => {
  if (!p) {
    throw new Error('mkdirp needs an argument')
  }

  const mode = _0777 & ~process.umask()

  if (!made) {
    made = null
  }

  p = path.resolve(p)

  let err

  try {
    await fs.mkdir(p, mode)
    made = made || p
  } catch (e) {
    if (e.code === 'ENOENT') {
      made = await mkdirP(path.dirname(p), made)
      await mkdirP(p, made)
    } else if (e.code === 'EEXIST') {
      err = null
    } else {
      err = e
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
