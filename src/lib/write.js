import fs from '@magic/fs'
import log from '@magic/log'
import path from 'path'

const write = async (file, config) => {
  const { bundle, out } = file

  try {
    if (out.startsWith(config.INCLUDES_DIR)) {
      // throw new Error(`Tried writing includes file ${out}`)
      return
    }

    // create directory for file if it does not exist
    await fs.mkdirp(path.dirname(out))

    // write file to disk
    const written = await fs.writeFile(out, bundle)

    log.info('writeFile', out)

    return written
  } catch (e) {
    log.error(e)
  }
}

export default write
