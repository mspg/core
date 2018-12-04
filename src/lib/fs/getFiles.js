const path = require('path')

const is = require('@magic/types')

const fs = require('./fs')

const getFiles = async (dirs = [process.cwd()]) => {
  if (is.string(dirs)) {
    dirs = [dirs]
  }

  const files = {}

  await Promise.all(
    dirs.map(async name => {
      if (!(await fs.exists(name))) {
        return
      }

      const stat = await fs.stat(name)

      if (stat.isFile()) {
        files[name] = {
          time: stat.mtime.getTime(),
        }
      } else if (stat.isDirectory()) {
        const f = await fs.readdir(name)
        const addFiles = await getFiles(f.map(file => path.join(name, file)))
        Object.assign(files, addFiles)
      }
    }),
  )

  return files
}

module.exports = getFiles
