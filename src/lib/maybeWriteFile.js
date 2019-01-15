const fs = require('./fs')
const path = require('path')

const imagemin = require('imagemin')
const imageminPng = require('imagemin-pngquant')
const imageminSvg = require('imagemin-svgo')
const imageminGif = require('imagemin-gifsicle')
const imageminJpg = require('imagemin-mozjpeg')
const imageminJimp = require('imagemin-jimp')
const log = require('@magic/log')

const transpileFile = require('./transpileFile')
const minifyFile = require('./minifyFile')

const {
  BUNDLE_DIR,
  OUT_DIR,
  IMAGE_EXTENSIONS,
  IGNORE_EXTENSIONS,
  MAX_IMAGE_WIDTH,
  MAX_IMAGE_HEIGHT,
  ENV,
} = require('../config')

const minifyImage = async file => {
  const input = [file]
  const output = path.dirname(file.replace(BUNDLE_DIR, OUT_DIR))
  return await imagemin(input, output, {
    plugins: [
      imageminJimp({ width: MAX_IMAGE_WIDTH, height: MAX_IMAGE_HEIGHT }),
      imageminJpg({ quality: 70 }),
      imageminPng({ quality: [0.6, 0.75] }),
      imageminGif({ optimizationLevel: 3 }),
      imageminSvg({
        plugins: [{ removeViewBox: false }],
      }),
    ],
  })
}

const maybeWriteFile = watchedFiles => async name => {
  try {
    const timeIndex = `minify: ${name.replace(BUNDLE_DIR, '')}`

    log.time(timeIndex)
    if (IMAGE_EXTENSIONS.some(ext => name.endsWith(ext))) {
      if (ENV === 'production') {
        const img = await minifyImage(name)
        log.timeEnd(timeIndex)
        return img
      }
    }

    const { buffer, out } = await fs.getFileContent({ name })

    if (IGNORE_EXTENSIONS.some(ext => name.endsWith(ext))) {
      log.info('File ignored by extension', name)
      return
    }

    const bundle = await transpileFile({ name, buffer })
    if (bundle) {
      const minified = await minifyFile({ name, bundle })
      await fs.write({ buffer, bundle: minified, out })
      watchedFiles[name].content = minified
      log.timeEnd(timeIndex)
      return minified
    }
  } catch (e) {
    throw e
  }
}

module.exports = maybeWriteFile
