const zopfli = require('node-zopfli')
const fs = require('fs')
const path = require('path')

const log = require('../log')
const conf = require('../config')()

const walk = (dir, done) => {
  let results = []
  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err)
    }

    let pending = list.length

    if (!pending) {
      return done(null, results)
    }

    list.forEach(file => {
      file = path.resolve(dir, file)
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res)

            pending -= 1
            if (pending === 0) {
              done(null, results)
            }
          })
        } else {
          results.push(file)
          pending -= 1
          if (pending === 0) {
            done(null, results)
          }
        }
      })
    })
  })
}

// simply tests if a file ends with .gz
const fileEndsWith = file => suffix =>
  file.indexOf(suffix) === file.length - suffix.length


// compress a single file
const zipFile = file => {
  // do not run for files we can compress with imagemin
  if (['.gz'].some(fileEndsWith(file))) {
    return
  }

  return new Promise((resolve, reject) => {
    const options = {
      verbose: false,
      verbose_more: false,
      numiterations: 15,
      blocksplitting: true,
      blocksplittinglast: false,
      blocksplittingmax: 15,
    }
    const zopferl = zopfli.createGzip(options)
    const writeStream = fs.createWriteStream(`${file}.gz`)

    const readStream = fs.createReadStream(file)
      .pipe(zopferl)
      .pipe(writeStream)

    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('close', resolve)
  })
}

const compressFiles = () =>
  new Promise((resolve, reject) => {
    if (!conf.TASKS.ZIP) {
      resolve()
      return
    }

    walk(conf.OUT_DIR, (err, files) => {
      const promises = files.map(zipFile)
      Promise.all(promises)
             .then(resolve)
             .catch(reject)
    })
  })

// main task, compresses all files in the public dir
const zip =
  () =>
    compressFiles()
      .then(() => console.log('zip done'))
      .catch(err => console.error(err))

module.exports = zip
