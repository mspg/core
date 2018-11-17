// git subtree push --prefix example/public origin gh-pages

const util = require('util')
const { exec } = require('child_process')

const log = require('@magic/log')

const conf = require('../config')
const { TASKS, GIT_ORIGIN, GIT_BRANCH, OUT_DIR, CWD } = conf

const xc = util.promisify(exec)

const connect = async () => {
  if (!TASKS.CONNECT) {
    return
  }

  log.info('start connect')
  log.time('connect')

  const outDir = OUT_DIR.replace(`${process.cwd()}/`, '')

  const cmdPrefix = `--prefix=${outDir}`
  const cmdOnto = `${GIT_ORIGIN} ${GIT_BRANCH}`
  const cmdArgv = `${cmdPrefix} ${cmdOnto}`
  const cmd = `git subtree push ${cmdArgv}`

  log('exec', cmd)

  try {
    const { stdout } = await xc(cmd)
  } catch (e) {
    throw e
  }

  log.timeEnd('connect')
}

module.exports = connect
