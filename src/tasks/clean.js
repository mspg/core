const fs = require('../lib/fs')
const log = require('@magic/log')

const conf = require('../config')
const { TASKS, OUT_DIR } = conf

const clean = async () => {
  if (!TASKS.CLEAN) {
    return
  }

  log('clean start', OUT_DIR)
  log.time('clean')
  
  try {
    await fs.rmrf(OUT_DIR)
  } catch(e) {
    throw e
  }

  log.timeEnd('clean')
}

module.exports = clean