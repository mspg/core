const path = require('path')

const zopfli = require('node-zopfli-es')
const log = require('@magic/log')

const fs = require('../lib/fs')
const conf = require('../config')

const walk = async dir => {
  try {
    let results = []
    const list = await fs.readdir(dir)

    await Promise.all(
      list.map(async file => {
        file = path.resolve(dir, file)
        const stat = await fs.stat(file)

        if (stat.isDirectory()) {
          const res = await walk(file)
          results = results.concat(res)
        } else if (stat.isFile()) {
          results.push(file)
        }
      }),
    )

    return results
  } catch (e) {
    throw e
  }
}

// compress a single file
const zipFile = file => {
  // image file
  if (conf.IMAGE_EXTENSIONS.some(ext => file.endsWith(ext))) {
    return
  }

  if (['.gz', 'CNAME'].some(ext => file.endsWith(ext))) {
    return
  }

  return new Promise((resolve, reject) => {
    const gzFileName = `${file}.gz`
    const options = {
      verbose: false,
      verbose_more: false,
      numiterations: 15,
      blocksplitting: true,
      blocksplittinglast: false,
      blocksplittingmax: 15,
    }
    const zopferl = zopfli.createGzip(options)
    const writeStream = fs.createWriteStream(gzFileName)

    const readStream = fs
      .createReadStream(file)
      .pipe(zopferl)
      .pipe(writeStream)

    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('close', async () => {
      const [gzSize, origSize] = await Promise.all(
        [gzFileName, file].map(async f => await fs.stat(f).size),
      )
      if (gzSize > origSize) {
        // gzip is bigger than original, delete gzipped file
        log.warn(file, 'gzipped file is bigger than original. deleting .gz')
        await fs.rmrf(gzFileName)
      }
      resolve()
    })
  })
}

// main task, compresses all files in the public dir
const zip = async () => {
  if (!conf.TASKS.ZIP) {
    return
  }

  log('start zipping')
  log.time('zip')

  try {
    const files = await walk(conf.OUT_DIR)

    await Promise.all(files.map(zipFile))

    log.timeEnd('zip')
  } catch (e) {
    throw e
  }
}

module.exports = zip
