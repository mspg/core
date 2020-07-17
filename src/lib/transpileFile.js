import is from '@magic/types'
import log from '@magic/log'
import fs from '@magic/fs'

import write from './write.js'
import transpileHTML from './transpile/html.js'

const transpileFile = async (file, config) => {
  const { TRANSPILERS } = config

  try {
    let { name, buffer } = file
    const type = fs.getFileType(name)

    if (type === 'html') {
      buffer = transpileHTML(file, config)
    }

    if (!is.empty(TRANSPILERS)) {

      const transpiler = TRANSPILERS[type.toLowerCase()] || TRANSPILERS[type.toUpperCase()]
      
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
  } catch (e) {
    log.error('error in lib/transpileFile', e)
    process.exit(1)
  }
}

export default transpileFile
