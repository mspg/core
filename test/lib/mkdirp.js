const path = require('path')
const fs = require('../../src/lib/fs')
const util = require('util')

const { is, tryCatch } = require('@magic/test')

const testDirRoot = path.join(__dirname, 'mkdirp')
const testDir = path.join(testDirRoot, 'deep', 'deeper')

const before = () => async () => {
  await fs.rmrf(testDirRoot)
}

module.exports = [
  { fn: tryCatch(fs.mkdirp), expect: is.error, info: 'mkdirp expects an argument' },
  {
    before,
    fn: async () => await fs.mkdirp(testDir),
    expect: async () => await fs.exists(testDir),
    info: 'mkdirp can succesfully write into a directory',
  },
]
