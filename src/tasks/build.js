const path = require('path')

const is = require('@magic/types')
const log = require('@magic/log')

const serve = require('./serve')
const fs = require('../lib/fs')

const conf = require('../config')

let watchedFiles = {}

const watch = async () => {
  const files = await fs.getFiles(conf.BUNDLE_DIR)
  const changedFiles = fs.getChangedFiles(watchedFiles, files)
  // setting cache after getting the changedFiles
  // leads to the first run building at all times, do not change the order pls.
  watchedFiles = files

  await Promise.all(changedFiles.map(fs.maybeWriteFile(watchedFiles, conf)))

  if (conf.WATCH) {
    setTimeout(watch, 300)
  }
}

const build = async () => {
  if (!conf.TASKS.BUILD) {
    return
  }

  log('start build')
  log.time('build')

  // actually run the task:
  try {
    await watch()

    if (conf.SERVE) {
      serve()
    }
  } catch (e) {
    throw e
  }

  log.timeEnd('build')
}

module.exports = build
