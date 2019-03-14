const fs = require('./fs')
const path = require('path')

const log = require('@magic/log')

const transpileFile = require('./transpileFile')
const minifyFile = require('./minifyFile')

const {
  BUNDLE_DIR,
  IGNORE_EXTENSIONS,
} = require('../config')

const maybeWriteFile = watchedFiles => async name => {
  try {
    const timeIndex = `minify: ${name.replace(BUNDLE_DIR, '')}`

    log.time(timeIndex)

    const { buffer, out } = await fs.getFileContent({ name })

    if (IGNORE_EXTENSIONS.some(ext => name.endsWith(ext))) {
      log.info('File ignored by extension', name)
      return
    }

    const bundle = await transpileFile({ name, buffer })
    if (bundle) {
      const minified = await minifyFile({ name, bundle })
      await fs.write({ buffer, bundle: minified, out })
      watchedFiles[name].content = minified
      log.timeEnd(timeIndex)
      return minified
    }
  } catch (e) {
    throw e
  }
}

module.exports = maybeWriteFile
