const path = require('path')

const is = require('@magic/types')
const log = require('@magic/log')

const serve = require('./serve')
const fs = require('../lib/fs')

const conf = require('../config')

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
  const typeArray = name.split('.')
  const type = typeArray[typeArray.length - 1]

  if (conf.IGNORE_EXTENSIONS.indexOf(type) > -1) {
    log.info('File ignored by extension', name)
    return
  }

  if (!is.empty(conf.TRANSPILERS)) {
    const transpiler = conf.TRANSPILERS[type.toUpperCase()]
    if (is.fn(transpiler)) {
      const bundler = Object.assign({ buffer, config: conf }, file)
      return await transpiler(bundler)
    }
  }

  // transpiler does not exist, just return stringified buffer as bundle
  return buffer
}

const fileCache = {}

const write = async file => {
  const { buffer, bundle, out } = file

  // no changes, resolve
  if (fileCache[out] && fileCache[out].content === buffer) {
    return file
  }

  // write file to "cache"
  fileCache[out] = file

  // create directory for file if it does not exist
  const outDir = path.dirname(out)
  await fs.mkdirp(outDir)

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

  await Promise.all(dirs.map(async name => {
    if (!await fs.exists(name)) {
      return
    }

    const stat = await fs.stat(name)

    if (stat.isFile()) {
      files[name] = stat.mtime.getTime()
    } else if (stat.isDirectory()) {
      const f = await fs.readdir(name)
      const addFiles = await getFiles(f.map(file => path.join(name, file)))
      Object.assign(files, addFiles)
    }
  }))

  return files
}

const watchedFiles = {
  bundle: [],
  includes: [],
}

const hasFileChanged = ([k, t]) => t > watchedFiles.bundle[k]

const watch = async () => {
  const files = await getFiles(conf.BUNDLE_DIR)

  let changedFiles = []
  if (is.empty(watchedFiles.bundle)) {
    changedFiles = Object.keys(files)
  } else {
    changedFiles = Object.entries(files)
      .filter(hasFileChanged)
      .map(([k]) => k)
  }

  // watchedFiles.includes = includes
  watchedFiles.bundle = files

  await Promise.all(changedFiles.map(async name => {
    const { buffer, out } = await getFileContent({ name })
    const bundle = await transpileFile({ name, buffer })
    if (bundle) {
      await write({ buffer, bundle, out })
    }
  }))

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
