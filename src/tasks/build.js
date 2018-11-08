const fso = require('fs')
const util = require('util')
const path = require('path')

const chokidar = require('chokidar')
const is = require('@magic/types')
const log = require('@magic/log')

const serve = require('./serve')
const mkdirp = require('./mkdirp')

const conf = require('../config')()

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

  if (conf.IGNORE_EXTENSIONS.indexOf(type) > -1) {
    log.info('File ignored by extension', name)
    return
  }

  const transpiler = conf.TRANSPILERS[type.toUpperCase()]
  if (is.fn(transpiler)) {
    const bundler = Object.assign({}, file, { buffer, config: conf })
    log('Bundling', file)
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

  console.log('mkdir', outDir)
  await fs.mkdir(outDir)
  const written = await fs.writeFile(out, bundle)

  log.info('writeFile', out)

  return written
}

const handleWatchUpdate = async ({ event, name, initDone, devWatcher }) => {
  if (!initDone && event === 'change') {
    return
  }
  const filesToBuild = []
  // also gets called on first run of watch dir indexing
  if (event === 'add' || event === 'change') {
    if (name.indexOf(conf.INCLUDES_DIR) > -1) {
      const [type] = name.replace(conf.INCLUDES_DIR, '').split('/').filter(e => e)

      Object.entries(devWatcher._watched)
        .filter(([dir]) => dir.indexOf(conf.BUNDLE_DIR) > -1)
        .forEach(([dir, { _items }]) =>
          Object.entries(_items)
            .filter(([item]) => item.indexOf(type) > -1)
            .forEach(([item]) => filesToBuild.push(`${dir}/${item}`))
        )
    } else {
      filesToBuild.push(name)
    }

    try {
      return await Promise.all(filesToBuild.map(async name => {
        const { buffer, out } = await getFileContent({ name })
        const bundle = await transpileFile({ name, buffer })
        if (bundle) {
          console.log('build', )
          return await write({ buffer, bundle, out })
        }
      }))
    } catch(e) {
      log.error(e)
    }
  }

  if (event === 'addDir') {
    await mkdirp(name)

    return
  }

  // if (event === 'unlink') {
  //
  // }

  log('Unhandled watch event:', { event, name })
}

const watcher = () => {
  const watchDirs = [
    conf.INCLUDES_DIR,
    conf.BUNDLE_DIR,
    path.join(conf.SRC_DIR, 'config.js'),
  ]

  log('Watching', watchDirs)

  let initDone = false

  const devWatcher = chokidar.watch(watchDirs, {
    ignored: ['**/node_modules/**', '**/public/**', '**/public', '**/.git/**'],
  })

  return new Promise((resolve, reject) => {
    devWatcher
      .on('all', async (event, name) => await handleWatchUpdate({ event, name, devWatcher, initDone, conf }))
      .on('ready', () => {
        initDone = true

        if (!conf.WATCH && !conf.SERVE) {
          devWatcher.close()
        }

        resolve()
      })
      .on('error', log.error)
  })
}

const build = async () => {
  if (!conf.TASKS.BUILD) {
    return
  }

  // actually run the task:
  try {
    await watcher()

    if (conf.SERVE) {
      serve(conf)
    }
  } catch (e) {
    throw e
  }
}

module.exports = build
