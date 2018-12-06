const log = require('@magic/log')
const is = require('@magic/types')

const serve = require('./serve')
const fs = require('../lib/fs')

const conf = require('../config')

let watchedFiles = {}

const watch = async () => {
  const files = await fs.getFiles([conf.BUNDLE_DIR, conf.INCLUDES_DIR])
  const changedFiles = fs.getChangedFiles(watchedFiles, files)
  if (!is.empty(changedFiles)) {
    console.log(changedFiles)
  }
  // setting cache after getting the changedFiles
  // leads to the first run building at all times,
  // do not change the order.
  watchedFiles = files

  await Promise.all(changedFiles.map(fs.maybeWriteFile(watchedFiles)))

  if (conf.WATCH) {
    setTimeout(watch, 300)
  }
}

const build = async () => {
  if (!conf.TASKS.BUILD && !conf.TASKS.SERVE) {
    return
  }

  // actually run the task:
  try {
    if (conf.TASKS.BUILD) {
      log('start build')
      log.time('build')
      await watch()
    }

    if (conf.TASKS.SERVE) {
      log.info('serve')
      serve()
    }
  } catch (e) {
    throw e
  }

  if (conf.TASKS.BUILD) {
    log.timeEnd('build')
  }
}

module.exports = build
