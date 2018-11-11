const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
const srcDir = path.join(cwd, 'example', 'src')
const publicDir = path.join(cwd, 'example', 'public')

const files = [
  'index.html',
  'main.css',
  'main.js',
]

const read = (p, f) => fs.readFileSync(path.join(p, f))

const matches = file => read(srcDir, file) === read(publicDir, file)

module.exports = [
  {
    fn: read(srcDir, 'index.html'),
    expect: read(publicDir, 'index.html'),
    info: 'html files match after building',
  },
  {
    fn: read(srcDir, 'main.css'),
    expect: read(publicDir, 'main.css'),
    info: 'css files match after building',
  },
  {
    fn: read(srcDir, 'main.js'),
    expect: read(publicDir, 'main.js'),
    info: 'js files match after building',
  },
]
