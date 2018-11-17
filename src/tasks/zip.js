const nfs = require('fs')
const path = require('path')
const util = require('util')

const zopfli = require('node-zopfli-es')

const log = require('@magic/log')

const conf = require('../config')

const fs = {
  readdir: util.promisify(nfs.readdir),
  stat: util.promisify(nfs.stat),
}

const walk = async (dir, done) => {
  try {
    let results = []
    const list = await fs.readdir(dir)

    await Promise.all(list.map(async file => {
      file = path.resolve(dir, file)
      const stat = await fs.stat(file)

      if (stat.isDirectory()) {
        const res = await walk(file)
        results = results.concat(res)
      } else if (stat.isFile()) {
        results.push(file)
      }
    }))

    return results
  } catch (e) {
    throw e
  }
}

// simply tests if a file ends with .gz
const fileEndsWith = file => suffix => file.indexOf(suffix) === file.length - suffix.length

// compress a single file
const zipFile = file => {
  // do not run for files we can compress with imagemin
  if (['.gif', '.jpg', '.jpeg', '.png'].some(fileEndsWith(file))) {
    // TODO: actually use imagemin
    return
  }

  if (['.gz', 'CNAME'].some(fileEndsWith(file))) {
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
    const writeStream = nfs.createWriteStream(gzFileName)

    const readStream = nfs
      .createReadStream(file)
      .pipe(zopferl)
      .pipe(writeStream)

    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('close', async () => {
      const [gzSize, origSize] = await Promise.all([gzFileName, file].map(async f => await fs.stat(f).size))
      if (gzSize > origSize) {
        // gzip is bigger than original, delete gzipped file
        log.warn(file, 'gzipped files is bigger than original. deleting .gz')
        fs.unlinkSync(gzFileName)
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
