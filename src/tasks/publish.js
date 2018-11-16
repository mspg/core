const util = require('util')
const { exec } = require('child_process')

const log = require('@magic/log')

const conf = require('../config')
const { TASKS, GIT_ORIGIN, GIT_BRANCH, OUT_DIR } = conf

const xc = util.promisify(exec)

const publish = async () => {
  if (!TASKS.PUBLISH) {
    return
  }

  log('start publish')
  log.time('publish')

  
  try {
    const outDir = OUT_DIR.replace(`${process.cwd()}/`, '')
  
    const cmdPrefix = `--prefix=${outDir}`
    const cmdOnto = `--onto=${GIT_ORIGIN}/${GIT_BRANCH}`
    const cmdArgv = `${cmdPrefix} ${cmdOnto}`
    const cmd = `git subtree split ${cmdArgv}`

    log('prepare', cmd)
    log.time('prepare')
    const { stdout } = await xc(cmd)
    const id = stdout.trim()
    log.timeEnd('prepare')

    const cmd2 = `git push ${GIT_ORIGIN} ${id.trim()}:${GIT_BRANCH}`
    log('push', cmd2)
    log.time('push')
    await xc(cmd2)
    log.timeEnd('push')
  } catch (e) {
    throw e
  }

  log.timeEnd('publish')
  log.success('publish finished')
}

module.exports = publish
