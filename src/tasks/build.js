const path = require('path')

const is = require('@magic/types')
const log = require('@magic/log')

const serve = require('./serve')
const fs = require('../lib/fs')
const getFileType = require('../lib/getFileType')

const conf = require('../config')

let watchedFiles = {}

const getFileContent = async file => {
  const { name } = file

  const buffer = await fs.readFile(name)

  const out = name.replace(conf.BUNDLE_DIR, conf.OUT_DIR)

  return {
    name,
    buffer,
    out,
  }
}

const transpileFile = async file => {
  const { name, buffer } = file
  const type = getFileType(name)
  if (conf.IGNORE_EXTENSIONS.indexOf(type) > -1) {
    log.info('File ignored by extension', name)
    return
  }

  if (!is.empty(conf.TRANSPILERS)) {
    const transpiler = conf.TRANSPILERS[type.toUpperCase()]
    if (is.function(transpiler)) {
      const bundler = Object.assign({ buffer, config: conf }, file)
      return await transpiler(bundler)
    }
  }

  // transpiler does not exist, just return stringified buffer as bundle
  return buffer
}

const minifyFile = file => {
  const { name, bundle } = file
  const type = getFileType(name)
  const minifier = conf.MINIFY[type.toUpperCase()]
  if (is.function(minifier)) {
    const minified = minifier(bundle.toString())
    return minified
  }

  return file.bundle
}

const fileCache = {}

const write = async file => {
  const { buffer, bundle, out } = file

  // no changes, resolve
  if (fileCache[out]) {
    if (fileCache[out].buffer.toString() === buffer.toString()) {
      return file
    }
  }

  // write file to "cache"
  fileCache[out] = file

  // create directory for file if it does not exist
  await fs.mkdirp(path.dirname(out))

  // write file to disk
  const written = await fs.writeFile(out, bundle)

  log.info('writeFile', out)

  return written
}

const getFiles = async (dirs = [process.cwd()]) => {
  if (is.string(dirs)) {
    dirs = [dirs]
  }

  const files = {}

  await Promise.all(
    dirs.map(async name => {
      if (!(await fs.exists(name))) {
        return
      }

      const stat = await fs.stat(name)

      if (stat.isFile()) {
        files[name] = {
          time: stat.mtime.getTime(),
        }
      } else if (stat.isDirectory()) {
        const f = await fs.readdir(name)
        const addFiles = await getFiles(f.map(file => path.join(name, file)))
        Object.assign(files, addFiles)
      }
    }),
  )

  return files
}

const hasFileChanged = ([k, t]) => t.time > watchedFiles[k].time

const getChangedFiles = files => {
  let changedFiles = []
  if (is.empty(watchedFiles)) {
    changedFiles = Object.keys(files)
  } else {
    changedFiles = Object.entries(files)
      .filter(hasFileChanged)
      .map(([k]) => k)
  }

  return changedFiles
}

const maybeWriteFile = async name => {
  try {
    const { buffer, out } = await getFileContent({ name })

    const bundle = await transpileFile({ name, buffer })
    if (bundle) {
      const minified = await minifyFile({ name, bundle })
      await write({ buffer, bundle: minified, out })
      watchedFiles[name].content = minified
      return minified
    }
  } catch (e) {
    throw e
  }
}

const watch = async () => {
  const files = await getFiles(conf.BUNDLE_DIR)
  const changedFiles = getChangedFiles(files)
  // setting cache after getting the changedFiles
  // leads to the first run building at all times, do not change the order pls.
  watchedFiles = files

  await Promise.all(changedFiles.map(maybeWriteFile))

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
