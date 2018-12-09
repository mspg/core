const is = require('@magic/types')
const getFileType = require('./getFileType')
const addTrailingSlash = require('../addTrailingSlash')
const config = require('../../config')

const { WEB_ROOT, TRANSPILERS, IGNORE_EXTENSIONS } = config

const transpileHTML = html =>
  html
    .replace(/{{ /gi, '{{')
    .replace(/ }}/gi, '}}')
    .replace(/{{WEB_ROOT}}/gi, addTrailingSlash(WEB_ROOT))

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
