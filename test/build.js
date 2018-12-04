// integration test for the build system.
// builds the example/ directory and tests the resulting files

const util = require('util')
const path = require('path')
const { exec } = require('child_process')

const xc = util.promisify(exec)
const fs = require('../src/lib/fs')

const beforeAll = async () => {
  try {
    const cmd = 'NODE_ENV=production mspg clean build zip'
    await xc(cmd)
  } catch (e) {
    throw e
  }
}

const dir = path.join(__dirname, '..', 'example')
const publicDir = path.join(dir, 'public')
const srcDir = path.join(dir, 'src')

const htmlExampleFile = path.join(publicDir, 'index.html')
const htmlFileExists = async () => await fs.exists(htmlExampleFile)
const htmlFileContents = async () => await fs.readFile(htmlExampleFile, 'utf8')

const doctypeExists = s => s.indexOf('<!DOCTYPE html>') === 0
const blockContentExists = s => s.indexOf('<h1>Welcome to mspg</h1>') > -1

const htmlZipFile = path.join(publicDir, 'index.html.gz')
const htmlZipFileExists = async () => await fs.exists(htmlZipFile)

const cssExampleFile = path.join(publicDir, 'main.css')
const cssFileExists = async () => await fs.exists(cssExampleFile)
const cssFileContents = async () => await fs.readFile(cssExampleFile, 'utf8')
const cssFileTest = '.red{color:red;} .green{color:green;}'

const cssZipFile = path.join(publicDir, 'main.css.gz')
const cssZipFileExists = async () => await fs.exists(cssZipFile)

const imgExampleFile = path.join(publicDir, 'img', 'testing', 'magic.jpg')
const imgSourceFile = path.join(srcDir, 'img', 'testing', 'magic.jpg')
const imgFileExists = async () => await fs.exists(imgExampleFile)
const imgFileIsEqual = async () => {
  const example = await fs.stat(imgExampleFile)
  const src = await fs.stat(imgSourceFile)
  return example.size === src.size
}

const jsExampleFile = path.join(publicDir, 'main.js')
const jsFileExists = async () => await fs.exists(jsExampleFile)
const jsFileContents = async () => await fs.readFile(jsExampleFile, 'utf8')

const jsSrcFile = path.join(srcDir, 'main.js')
const jsFileTest = async () => await fs.readFile(jsSrcFile)

const jsZipFile = path.join(publicDir, 'main.js.gz')
const jsZipFileExists = async () => await fs.exists(jsZipFile)

module.exports = {
  beforeAll,
  tests: [
    { fn: htmlFileExists, expect: true, info: 'public/index.html exists' },
    { fn: htmlZipFileExists, expect: true, info: 'public/index.html.gz exists' },
    {
      fn: htmlFileContents,
      expect: blockContentExists,
      info: 'public/index.html contains extended content block',
    },
    {
      fn: htmlFileContents,
      expect: doctypeExists,
      info: 'public/index.html contains doctype',
    },

    { fn: cssFileExists, expect: true, info: 'public/main.css exists' },
    { fn: cssZipFileExists, expect: true, info: 'public/main.css.gz exists' },
    {
      fn: cssFileContents,
      expect: cssFileTest,
      info: 'public/main.css contains reset.css',
    },

    { fn: imgFileExists, expect: true, info: 'public/img/testing/magic.jpg exists' },
    { fn: imgFileIsEqual, expect: true, info: 'image is equal to source' },

    { fn: jsFileExists, expect: true, info: 'public/main.js exists' },
    { fn: jsFileContents, expect: jsFileTest, info: 'main.js contains content' },
    { fn: jsZipFileExists, expect: true, info: 'public/main.js.gz exists' },
  ],
}
