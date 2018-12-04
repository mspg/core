const fs = require('./fs')

const conf = require('../../config')

const getFileContent = async (file) => {
  const { name } = file

  const buffer = await fs.readFile(name)

  const out = name.replace(conf.BUNDLE_DIR, conf.OUT_DIR)

  return {
    name,
    buffer,
    out,
  }
}

module.exports = getFileContent
