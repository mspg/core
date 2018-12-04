const getFileContent = require('./getFileContent')
const transpileFile = require('./transpileFile')
const minifyFile = require('./minifyFile')
const write = require('./write')

const maybeWriteFile = (watchedFiles, conf) => async name => {
  try {
    const { buffer, out } = await getFileContent({ name }, conf)

    const bundle = await transpileFile({ name, buffer }, conf)
    if (bundle) {
      const minified = await minifyFile({ name, bundle }, conf)
      await write({ buffer, bundle: minified, out })
      watchedFiles[name].content = minified
      return minified
    }
  } catch (e) {
    throw e
  }
}

module.exports = maybeWriteFile