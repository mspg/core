const log = require('../log')
const conf = require('../config')()

const zip =
  () =>
    new Promise((resolve) => {
      if (!conf.TASKS.ZIP) {
        resolve()
        return
      }

      log('zip')
      resolve()
    })


module.exports = zip
