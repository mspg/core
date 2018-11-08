const util = require('util')
const browserSync = require('browser-sync')
const sync = util.promisify(browserSync)

const log = require('@magic/log')

const conf = require('../config')()

const serve = async () => {
  const bsConfig = {
    server: {
      baseDir: conf.OUT_DIR,
      files: conf.OUT_DIR,
      index: 'index.html',
      serveStaticOptions: {
        extensions: ['html'],
      },
    },
    open: false,
  }

  await browserSync(bsConfig)
}

module.exports = serve
