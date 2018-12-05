const getFileContent = require('./getFileContent')
const transpileFile = require('./transpileFile')
const minifyFile = require('./minifyFile')
const write = require('./write')

const maybeWriteFile = watchedFiles => async name => {
  try {
    const { buffer, out } = await getFileContent({ name })

    const bundle = await transpileFile({ name, buffer })
    if (bundle) {
      const minified = await minifyFile({ name, bundle })
      await write({ buffer, bundle: minified, out })
      watchedFiles[name].content = minified
      return minified
    }
  } catch (e) {
    throw e
  }
}

module.exports = maybeWriteFile
