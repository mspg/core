const path = require('path')
const nfs = require('fs')
const util = require('util')

const fs = {
  exists: util.promisify(nfs.exists),
  rmdir: util.promisify(nfs.rmdir),
}

const { is, tryCatch } = require('@magic/test')

const mkdirp = require('../../src/lib/mkdirp.js')
const rmrf = require('../../src/lib/rmrf.js')

const testDirRoot = path.join(__dirname, 'rmrf')
const testDir = path.join(testDirRoot, 'deep', 'deeper')

const before = async () => {
  await mkdirp(testDir)
}

module.exports = [
  { fn: tryCatch(rmrf), expect: is.error, info: 'rmrf expects an argument' },
  {
    fn: async () => await rmrf(testDirRoot),
    before,
    expect: async () => !(await fs.exists(testDirRoot)),
    info: 'rmrf deeply deletes directory structures',
  },
  {
    fn: async () => await rmrf(path.join(__dirname, 'non', 'existent', 'dir')),
    expect: undefined,
    info: 'rmrf returns undefined if the directory/file does no exist',
  },
]
