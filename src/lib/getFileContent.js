import fs from '@magic/fs'
import path from 'path'

const getFileContent = async (file, conf) => {
  const { name } = file

  const contentType = fs.getContentType(name)

  let textFmt
  if (contentType.startsWith('text/') || contentType === 'application/javascript') {
    textFmt = 'utf8'
  }

  if (!path.extname(name)) {
    return
  }

  const buffer = await fs.readFile(name, textFmt)

  const out = name.replace(conf.BUNDLE_DIR, conf.OUT_DIR)

  return {
    name,
    buffer,
    out,
  }
}

export default getFileContent
