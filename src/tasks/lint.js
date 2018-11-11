const util = require('util')
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const log = require('@magic/log')

const conf = require('../config')

const xc = util.promisify(exec)
const exists = util.promisify(fs.exists)

const lintHtml = async () => {
  if (!conf.LINT.HTML) {
    return
  }

  const executable = path.join('node_modules', '.bin', 'pug-lint')
  let config = path.join(conf.BUILD_DIR, 'pug-lintrc.js')

  try {
    const configExists = await exists(config)
    if (!configExists) {
      config = path.join(__dirname, './config/pug-lintrc.js')
    }
  } catch (e) {
    throw e
  }

  const filesToLint = [
    path.join(conf.BUNDLE_DIR, '*.html'),
    path.join(conf.INCLUDES_DIR, 'html', '*.pug'),
  ].join(' ')

  const cmd = `${executable} --config ${config} ${filesToLint}`

  try {
    const res = await xc(cmd)

    log('pug-lint results:', res)

    return res
  } catch (e) {
    log.error(e)
  }
}

const lintCss = async () => {
  if (!conf.LINT.CSS) {
    return
  }

  const executable = path.join('node_modules', '.bin', 'stylint')

  const configPath = path.join(__dirname, 'config', '.stylintrc')
  const filesToLint = [path.join(conf.BUNDLE_DIR, '*.css'), path.join(conf.INCLUDES_DIR, 'css')]

  let timesReturned = 0

  try {
    await Promise.all(
      filesToLint.map(async dir => {
        const cmd = `${executable} --config ${configPath} ${dir}`
        // console.log('exec :', cmd)
        const { stdout } = await xc(cmd)

        log('stylint results:', stdout)

        timesReturned += 1
        if (timesReturned >= filesToLint.length) {
          return
        }
      }),
    )
  } catch (e) {
    log.error(e)
  }
  log('stylint finished')
}

const lint = async () => {
  if (!conf.LINT.HTML && !conf.LINT.CSS) {
    return
  }

  try {
    await lintHtml()
    await lintCss()
    log('Linting completed')
  } catch (e) {
    log.error(e)
  }
}

module.exports = lint
