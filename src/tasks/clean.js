import fs from '@magic/fs'
import log from '@magic/log'

export const clean = async conf => {
  const { TASKS, OUT_DIR } = conf

  if (!TASKS.CLEAN) {
    return
  }

  log('clean start', OUT_DIR)
  log.time('clean')

  try {
    await fs.rmrf(OUT_DIR)
  } catch (e) {
    throw e
  }

  log.timeEnd('clean')
}

export default clean
