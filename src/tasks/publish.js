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

  const outDirArray = OUT_DIR.split('/')
  const outDir = outDirArray[outDirArray.length - 1]

  const cmdPrefix = `--prefix=${outDir}`
  const cmdOnto = `--onto=${GIT_ORIGIN}/${GIT_BRANCH}`
  const cmdArgv = `${cmdPrefix} ${cmdOnto}`
  const cmd = `git subtree split ${cmdArgv}`

  log('exec', cmd)

  try {
    const { stdout } = await xc(cmd)
    const id = stdout.trim()

    console.log(id)

    const cmd2 = `git push ${GIT_ORIGIN} ${id.trim()}:${GIT_BRANCH}`
    await xc(cmd2)
    log.success('publish finished')
  } catch (e) {
    throw e
  }
}

module.exports = publish
