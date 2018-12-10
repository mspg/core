const is = require('@magic/types')
const getFileType = require('./getFileType')
const config = require('../../config')
const transpileHTML = require('../transpile/html')

const { TRANSPILERS, IGNORE_EXTENSIONS } = config

const transpileFile = async file => {
  let { name, buffer } = file
  const type = getFileType(name)
  if (IGNORE_EXTENSIONS.includes(type)) {
    log.info('File ignored by extension', name)
    return
  }

  if (type === 'html') {
    buffer = transpileHTML(buffer)
  }

  if (!is.empty(TRANSPILERS)) {
    const transpiler = TRANSPILERS[type.toUpperCase()]
    if (is.function(transpiler)) {
      const bundler = { buffer, config, ...file }
      return await transpiler(bundler)
    }
  }

  // transpiler does not exist, just return stringified buffer as bundle
  return buffer
}

module.exports = transpileFile
