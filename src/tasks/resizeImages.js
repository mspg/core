import fs from '@magic/fs'
import Jimp from 'jimp'

import conf from '../config.js'

export const resizeImages = async () => {
  const {
    BUNDLE_DIR,
    IMAGE_EXTENSIONS,
    MAX_IMAGE_WIDTH,
    MAX_IMAGE_HEIGHT,
    IMAGE_QUALITY,
    TASKS,
  } = await conf()

  if (!TASKS.RESIZE_IMAGES) {
    return
  }

  const files = await fs.getFiles(BUNDLE_DIR)
  Object.entries(files)
    .filter(([name]) => IMAGE_EXTENSIONS.some(ext => name.endsWith(ext)))
    .map(([name, mtime]) => {
      Jimp.read(name, (err, img) => {
        if (err) {
          throw err
        }

        let w = Math.min(img.bitmap.width, MAX_IMAGE_WIDTH)
        let h = Jimp.AUTO

        // height overwrites width if needed
        if (img.bitmap.height < MAX_IMAGE_HEIGHT) {
          h = img.bitmap.height
          w = Jimp.AUTO
        } else if (img.bitmap.height > MAX_IMAGE_HEIGHT) {
          h = MAX_IMAGE_HEIGHT
          w = Jimp.AUTO
        }

        img
          .resize(w, h) // resize
          .quality(IMAGE_QUALITY) // set JPEG quality
          .write(name) // save
      })
    })
}

export default resizeImages
