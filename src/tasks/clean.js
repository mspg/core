const fs = require('../lib/fs')
const log = require('@magic/log')

const conf = require('../config')
const { TASKS, OUT_DIR } = conf

const clean = async () => {
  try {
    log('cleaning public dir', OUT_DIR)
    const rmd = await fs.rmrf(OUT_DIR)
    log('clean finished')
    return rmd
  } catch(e) {
    throw e
  }
}

module.exports = clean