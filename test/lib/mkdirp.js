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

const testDirRoot = path.join(__dirname, 'mkdirp')
const testDir = path.join(testDirRoot, 'deep', 'deeper')

const before = () => async () => {
  await rmrf(testDirRoot)
}

module.exports = [
  { fn: tryCatch(mkdirp), expect: is.error, info: 'mkdirp expects an argument' },
  { fn: async () => await mkdirp(testDir), before, expect: async () => await fs.exists(testDir) },
]
