const is = require('@magic/types')
const getFileType = require('./getFileType')

const conf = require('../../config')

const transpileHTML = html =>
  html
    .replace(/{{ /gi, '{{')
    .replace(/ }}/gi, '}}')
    .replace(/{{WEB_ROOT}}/gi, conf.WEB_ROOT)

const transpileFile = async (file) => {
  let { name, buffer } = file
  const type = getFileType(name)
  if (conf.IGNORE_EXTENSIONS.indexOf(type) > -1) {
    log.info('File ignored by extension', name)
    return
  }

  if (type === 'html') {
    buffer = transpileHTML(buffer.toString())
  }

  if (!is.empty(conf.TRANSPILERS)) {
    const transpiler = conf.TRANSPILERS[type.toUpperCase()]
    if (is.function(transpiler)) {
      const bundler = { buffer, config: conf, ...file }
      return await transpiler(bundler)
    }
  }

  // transpiler does not exist, just return stringified buffer as bundle
  return buffer
}

module.exports = transpileFile
