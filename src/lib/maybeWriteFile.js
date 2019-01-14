const fs = require('./fs')
const path = require('path')

const transpileFile = require('./transpileFile')
const minifyFile = require('./minifyFile')

const { BUNDLE_DIR, OUT_DIR, IMAGE_EXTENSIONS } = require('../config')

const imagemin = require('imagemin')
const imageminPng = require('imagemin-pngquant')
const imageminSvg = require('imagemin-svgo')
const imageminGif = require('imagemin-gifsicle')
const imageminJpg = require('imagemin-mozjpeg')

const minifyImage = async (file) => {
  const input = [file]
  const output = path.dirname(file.replace(BUNDLE_DIR, OUT_DIR))
  return await imagemin(input, output, {
    plugins: [
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
      return await minifyImage(name)
    }

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
