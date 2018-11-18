const fso = require('fs')
const util = require('util')

const fs = {
  exists: util.promisify(fso.exists),
  mkdir: util.promisify(fso.mkdir),
  readdir: util.promisify(fso.readdir),
  readFile: util.promisify(fso.readFile),
  stat: util.promisify(fso.stat),
  writeFile: util.promisify(fso.writeFile),
  createReadStream: fso.createReadStream,
  createWriteStream: fso.createWriteStream,
}

module.exports = fs
