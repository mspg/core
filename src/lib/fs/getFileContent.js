const fs = require('./fs')
const getContentType = require('./getContentType')

const conf = require('../../config')

const getFileContent = async file => {
  const { name } = file

  const contentType = getContentType(name)
  let textFmt
  if (contentType.startsWith('text/') || contentType === 'application/javascript') {
    textFmt = 'utf8'
  }

  const buffer = await fs.readFile(name, textFmt)

  const out = name.replace(conf.BUNDLE_DIR, conf.OUT_DIR)

  return {
    name,
    buffer,
    out,
  }
}

module.exports = getFileContent
