// git subtree push --prefix example/public origin gh-pages

import log from '@magic/log'

import xc from '../lib/xc.js'

export const connect = async conf => {
  const { TASKS, GIT_ORIGIN, GIT_BRANCH, OUT_DIR } = conf

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
    await xc(cmd)
  } catch (e) {
    throw e
  }

  log.timeEnd('connect')
}

export default connect
