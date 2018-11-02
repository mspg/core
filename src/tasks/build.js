const fso = require('fs')
const util = require('util')
const path = require('path')

const chokidar = require('chokidar')
const is = require('@magic/types')

const serve = require('./serve')
const mkdirp = require('./mkdirp')

const log = require('../log')
const conf = require('../config')()

const mkd = util.promisify(fso.mkdir)

const mkdir = async path => {
  try {
    await mkd(path)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}

const fs = {
  readFile: util.promisify(fso.readFile),
  writeFile: util.promisify(fso.writeFile),
  mkdir: mkdirp,
}

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

  const transpiler = conf.TRANSPILERS[type.toUpperCase()]
  if (is.fn(transpiler)) {
    const bundler = Object.assign({}, file, { buffer, config: conf })

    return await transpiler(bundler)
  }

  // transpiler does not exist, just return stringified buffer as bundle
  return buffer
}

const fileCache = {}

const write = async file => {
  const { buffer, bundle, out } = file

  // no changes, resolve
  if (fileCache[out] && fileCache[out].content === buffer.toString()) {
    return file
  }

  // write file to "cache"
  fileCache[out] = file

  // write file to disk
  // create directory for file if it does not exist
  const outDir = path.dirname(out)

  await mkdirp(outDir)
  const written = await fs.writeFile(out, bundle)

  log.success('writeFile', out)

  return written
}

const handleWatchUpdate = async ({ event, name, initDone, devWatcher }) => {
  // if file is not in src dir, we do not have to do anything.
  if (name.indexOf(conf.BUNDLE_DIR) < 0) {
    return
  }

  // gets called on first run of watch dir indexing
  if (event === 'add' || event === 'change') {
    const { buffer, out } = await getFileContent({ name })
    const bundle = await transpileFile({ name, buffer })
    const written = await write({ buffer, bundle, out })

    return written
  }

  if (event === 'addDir') {
    await fs.mkdir(name)

    return
  }

  log('Unhandled watch event:', { event, name })
}

const watcher = () => {
  log('Watching', conf.SRC_DIR)

  let initDone = false

  const devWatcher = chokidar.watch(conf.SRC_DIR, {
    ignored: ['**/node_modules/**', '**/public/**', '**/public', '**/.git/**'],
  })

  return new Promise((resolve, reject) => {
    devWatcher
      .on('all', (event, name) => {
        try {
          handleWatchUpdate({ event, name, devWatcher, initDone, conf })
        }
        catch(e) {
          throw e
        }
      })
      .on('ready', () => {
        initDone = true

        if (!conf.WATCH && !conf.SERVE) {
          devWatcher.close()
        }
        resolve()
      })
  })
}

const build = async () => {
  if (!conf.TASKS.BUILD) {
    return
  }

  // actually run the app:
  try {
    await watcher()

    if (conf.SERVE) {
      serve(conf)
    }
  }
  catch(e) {
    throw e
  }
}

module.exports = build
