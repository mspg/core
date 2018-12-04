const is = require('@magic/types')
const getFileType = require('./getFileType')

const transpileFile = async (file, conf) => {
  const { name, buffer } = file
  const type = getFileType(name)
  if (conf.IGNORE_EXTENSIONS.indexOf(type) > -1) {
    log.info('File ignored by extension', name)
    return
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
