const util = require('util')
const path = require('path')
const fs = require('./fs')
const _0777 = parseInt('0777', 8)

const mkdirP = async p => {
  if (!p) {
    throw new Error('mkdirp needs an argument')
  }

  p = path.resolve(p)

  try {
    const dir = path.dirname(p)
    if (!(await fs.exists(dir))) {
      await mkdirP(dir)
    }
    await fs.mkdir(p)
    return true
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}

module.exports = mkdirP
