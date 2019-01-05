const fs = require('./fs')
const transpileFile = require('./transpileFile')
const minifyFile = require('./minifyFile')

const maybeWriteFile = watchedFiles => async name => {
  try {
    const { buffer, out } = await fs.getFileContent({ name })

    const bundle = await transpileFile({ name, buffer })
    if (bundle) {
      const minified = await minifyFile({ name, bundle })
      await fs.write({ buffer, bundle: minified, out })
      watchedFiles[name].content = minified
      return minified
    }
  } catch (e) {
    throw e
  }
}

module.exports = maybeWriteFile
