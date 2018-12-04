const path = require('path')

const { is, tryCatch } = require('@magic/test')

const fs = require('../../../src/lib/fs')

const testDirRoot = path.join(__dirname, 'rmrf')
const testDir = path.join(testDirRoot, 'deep', 'deeper')

const before = async () => {
  await fs.mkdirp(testDir)
}

module.exports = [
  { fn: tryCatch(fs.rmrf), expect: is.error, info: 'rmrf expects an argument' },
  {
    fn: async () => await fs.rmrf(testDirRoot),
    before,
    expect: async () => !(await fs.exists(testDirRoot)),
    info: 'rmrf deeply deletes directory structures',
  },
  {
    fn: async () => await fs.rmrf(path.join(__dirname, 'non', 'existent', 'dir')),
    expect: undefined,
    info: 'rmrf returns undefined if the directory/file does no exist',
  },
]
