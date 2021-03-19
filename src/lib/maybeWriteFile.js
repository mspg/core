import log from '@magic/log'
import is from '@magic/types'

import transpileFile from './transpileFile.js'
import minifyFile from './minifyFile.js'
import getFileContent from './getFileContent.js'
import write from './write.js'
import sharp from 'sharp'

const maybeWriteFile = (watchedFiles, conf) => async name => {
  if (is.array(name)) {
    name = name[0]
  }

  try {
    const { IGNORE_EXTENSIONS } = conf

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

      const images = ['jpg', 'png', 'gif']

      const isImage = images.some(type => name.endsWith(type.toLowerCase()) || name.endsWith(type.toUpperCase()))

      // save all images as webp too
      if (isImage) {
        const webpOut = out.replace(/\.(jpg|png|gif)$/gim, '.webp')

        // pages: -1 saves all frames of animated gifs
        await sharp(name, { pages: -1 }).toFile(webpOut)
      }

      watchedFiles[name].content = minified

      // log.timeEnd(timeIndex)

      return minified
    }
  } catch (e) {
    throw e
  }
}

export default maybeWriteFile
