const is = require('@magic/types')
const getFileType = require('./getFileType')

const conf = require('../../config')

const minifyFile = file => {
  const { name, bundle } = file
  const type = getFileType(name)
  const minifier = conf.MINIFY && conf.MINIFY[type.toUpperCase()]
  if (is.function(minifier)) {
    const minified = minifier(bundle, conf)
    return minified
  }

  return file.bundle
}

module.exports = minifyFile