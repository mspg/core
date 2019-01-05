const is = require('@magic/types')
const getFileType = require('./fs/getFileType')
const config = require('../config')
const transpileHTML = require('./transpile/html')
const { write } = require('./fs/')

const { TRANSPILERS, IGNORE_EXTENSIONS } = config

const transpileFile = async file => {
  try {
    let { name, buffer } = file
    const type = getFileType(name)
    if (IGNORE_EXTENSIONS.includes(type)) {
      log.info('File ignored by extension', name)
      return
    }

    if (type === 'html') {
      buffer = transpileHTML(file)
    }

    if (!is.empty(TRANSPILERS)) {
      const transpiler = TRANSPILERS[type.toUpperCase()]
      if (is.function(transpiler)) {
        const bundler = { ...file, config, buffer }
        const transpiled = await transpiler(bundler)
        if (is.error(transpiled)) {
          throw transpiled
        } else if (is.string(transpiled)) {
          return transpiled
        } else if (is.object(transpiled)) {
          if (transpiled.sourcemap) {
            const out = `${file.name}.map`.replace(config.BUNDLE_DIR, config.OUT_DIR)
            await write({ out, bundle: JSON.stringify(transpiled.sourcemap) })
          }

          return transpiled.buffer
        }
      }
    }

    // transpiler does not exist, just return stringified buffer as bundle
    return buffer
  } catch(e) {
    log.error('error in lib/transpileFile', e)
    process.exit(1)
  }

}

module.exports = transpileFile
