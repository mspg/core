const is = require('@magic/types')
const fs = require('./fs')

const conf = require('../../config')

const minifyFile = file => {
  const { name, bundle } = file
  const type = fs.getFileType(name)
  const minifier = conf.MINIFY && conf.MINIFY[type.toUpperCase()]
  if (is.function(minifier)) {
    const minified = minifier(bundle, conf)
    return minified
  }

  return file.bundle
}

module.exports = minifyFile
