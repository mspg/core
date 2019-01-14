const fs = require('./fs')
const path = require('path')

const imagemin = require('imagemin')
const imageminPng = require('imagemin-pngquant')
const imageminSvg = require('imagemin-svgo')
const imageminGif = require('imagemin-gifsicle')
const imageminJpg = require('imagemin-mozjpeg')
const log = require('@magic/log')

const transpileFile = require('./transpileFile')
const minifyFile = require('./minifyFile')

const {
  BUNDLE_DIR,
  OUT_DIR,
  IMAGE_EXTENSIONS,
  MAX_IMAGE_WIDTH,
  MAX_IMAGE_HEIGHT,
} = require('../config')

const imageminSharp = require('./imagemin-sharp')

const minifyImage = async file => {
  const input = [file]
  const output = path.dirname(file.replace(BUNDLE_DIR, OUT_DIR))
  return await imagemin(input, output, {
    plugins: [
      imageminSharp({ width: MAX_IMAGE_WIDTH, height: MAX_IMAGE_HEIGHT }),
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
    if (IMAGE_EXTENSIONS.some(ext => name.endsWith(ext))) {
      log('minify image:', name.replace(BUNDLE_DIR, ''))
      return await minifyImage(name)
    }

    const { buffer, out } = await fs.getFileContent({ name })

    const bundle = await transpileFile({ name, buffer })
    if (bundle) {
      const minified = await minifyFile({ name, bundle })
      await fs.write({ buffer, bundle: minified, out })
      watchedFiles[name].content = minified
      log('minified file:', name.replace(BUNDLE_DIR, ''))
      return minified
    }
  } catch (e) {
    throw e
  }
}

module.exports = maybeWriteFile
