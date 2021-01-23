import log from '@magic/log'

import transpileFile from './transpileFile.js'
import minifyFile from './minifyFile.js'
import getFileContent from './getFileContent.js'
import write from './write.js'

const maybeWriteFile = (watchedFiles, conf) => async ([name]) => {
  try {
    const { BUNDLE_DIR, IGNORE_EXTENSIONS } = conf

    // const timeIndex = `minify: ${name.replace(BUNDLE_DIR, '')}`

    // log.time(timeIndex)

    const result = await getFileContent({ name }, conf)
    if (!result) {
      return
    }

    const { buffer, out } = result

    if (IGNORE_EXTENSIONS.some(ext => name.endsWith(ext))) {
      log.info('File ignored by extension', name)
      return
    }

    const bundle = await transpileFile({ name, buffer }, conf)

    if (bundle) {
      const minified = await minifyFile({ name, bundle }, conf)

      await write({ buffer, bundle: minified, out }, conf)

      watchedFiles[name].content = minified

      // log.timeEnd(timeIndex)

      return minified
    }
  } catch (e) {
    throw e
  }
}

export default maybeWriteFile
