import log from '@magic/log'

import xc from '../lib/xc.js'

export const publish = async conf => {
  const { TASKS, GIT_ORIGIN, GIT_BRANCH, OUT_DIR } = conf

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

export default publish
