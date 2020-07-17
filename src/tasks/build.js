import log from '@magic/log'
import is from '@magic/types'

import serve from './serve.js'
import getChangedFiles from '../lib/getChangedFiles.js'
import getFiles from '../lib/getFiles.js'
import maybeWriteFile from '../lib/maybeWriteFile.js'

let watchedFiles = {}

export const watch = async conf => {
  const bundleFiles = await getFiles(conf.BUNDLE_DIR)
  const includesFiles = await getFiles(conf.INCLUDES_DIR)

  const files = { ...bundleFiles, ...includesFiles }

  const changedFiles = await getChangedFiles(watchedFiles, files)

  if (!is.empty(changedFiles)) {
    log.info('changed files', changedFiles)
  }

  // setting cache after getting the changedFiles
  // leads to the first run building at all times,
  // do not change the order.
  watchedFiles = files

  await Promise.all(changedFiles.map(maybeWriteFile(watchedFiles, conf)))

  if (conf.WATCH) {
    setTimeout(() => watch(conf), 300)
  }
}

export const build = async conf => {
  if (!conf.TASKS.BUILD && !conf.TASKS.SERVE) {
    return
  }

  // actually run the task:
  try {
    if (conf.TASKS.BUILD) {
      log('start build')
      log.time('build')
      await watch(conf)
    }

    if (conf.TASKS.SERVE) {
      log.info('serve')
      serve(conf)
    }
  } catch (e) {
    throw e
  }

  if (conf.TASKS.BUILD) {
    log.timeEnd('build')
  }
}

export default build
