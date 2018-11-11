const fso = require('fs')
const util = require('util')

const fs = {
  readFile: util.promisify(fso.readFile),
  stat: util.promisify(fso.stat),
  writeFile: util.promisify(fso.writeFile),
  readdir: util.promisify(fso.readdir),
  exists: util.promisify(fso.exists),
  mkdirp: require('./mkdirp'),
  rmrf: require('./rmrf'),
}

module.exports = fs
