const { is } = require('@magic/test')

const fs = require('../../../src/lib/fs')

const types = {
  mkdirp: is.fn,
  rmrf: is.fn,
  exists: is.fn,
  mkdir: is.fn,
  readdir: is.fn,
  readFile: is.fn,
  stat: is.fn,
  writeFile: is.fn,
  createReadStream: is.fn,
  createWriteStream: is.fn,
  getFiles: is.fn,
  getFileContent: is.fn,
  getChangedFiles: is.fn,
  hasFileChanged: is.fn,
  contentTypes: is.obj,
  getFileType: is.fn,
  getContentType: is.fn,
  transpileFile: is.fn,
  minifyFile: is.fn,
  maybeWriteFile: is.fn,
  write: is.fn,
  rmdir: is.fn,
  rmDir: is.fn,
  unlink: is.fn,
  rm: is.fn,
  resolveUrl: is.fn,
}

module.exports = [
  { fn: () => fs, expect: is.object, info: 'fs is an object' },
  {
    fn: () => fs.exists,
    expect: is.fn,
    info: 'fs.exists is a function to make sure the contentTypes loop works',
  },
  {
    fn: () => Object.entries(fs).filter(([k, v]) => !types[k](v)),
    expect: is.empty,
    info: 'all values of fs are correct type',
  },
]
