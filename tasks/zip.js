const log = require('../log')
const conf = require('../config')()

const zip =
  () => {
    conf.TASKS.ZIP &&
    new Promise((resolve) => {
      log('zip')
      resolve()
    })
  }

module.exports = zip
