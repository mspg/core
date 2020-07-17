import path from 'path'
import fs from '../../../src/lib/fs'

import { is, tryCatch } from '@magic/test'

const testDirRoot = path.join(__dirname, 'mkdirp')
const testDir = path.join(testDirRoot, 'deep', 'deeper')

const before = () => async () => {
  await fs.rmrf(testDirRoot)
}

export default [
  { fn: tryCatch(fs.mkdirp), expect: is.error, info: 'mkdirp expects an argument' },
  {
    before,
    fn: async () => await fs.mkdirp(testDir),
    expect: async () => await fs.exists(testDir),
    info: 'mkdirp can succesfully write into a directory',
  },
]
