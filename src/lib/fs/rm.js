const fs = require('./fs')
const path = require('path')

const rm = async dirOrFile => {
  const stat = await fs.stat(dirOrFile)

  if (stat.isFile()) {
    return await fs.unlink(dirOrFile)
  } else if (stat.isDirectory()) {
    const files = await fs.readdir(dirOrFile)
    await Promise.all(files.map(f => rm(path.join(dirOrFile, f))))
    return await fs.rmDir(dirOrFile)
  }
}

module.exports = rm
