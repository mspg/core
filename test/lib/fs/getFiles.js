const path = require('path')

const { is, promise } = require('@magic/test')

const fs = require('../../../src/lib/fs')

const dir = path.join(process.cwd(), 'example')

const filesInDir = 11

const dirName = path.join(__dirname, '.__test__')

const files = [
  path.join(dirName, 'test', 'deep', 'test.js'),
  path.join(dirName, 'test2', 'deep', 'test2.js'),
  path.join(dirName, 'test.js'),
]

const before = async () => {
  await fs.mkdirp(path.join(dirName, 'test', 'deep'))
  await fs.mkdirp(path.join(dirName, 'test2', 'deep'))

  await Promise.all(
    files.map(async f => {
      // console.log(f)
      return await fs.writeFile(f, 't')
    }),
  )

  return async () => {
    await fs.rm(dirName)
  }
}

module.exports = [
  {
    fn: async () => await fs.getFiles(dirName),
    before,
    expect: is.object,
    info: 'finds all files in directory. recursively.',
  },
]
