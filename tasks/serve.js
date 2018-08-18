const browserSync = require('browser-sync')

const log = require('../log')
const conf = require('../config')()

const serve = () => {
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

  browserSync(bsConfig, (err, bs) => {
    if (err) {
      log.error(err)
      return
    }
    const url = bs.options.getIn(['urls', 'local'])
    log.success('server listening to http://', url)
  })
}

module.exports = serve
