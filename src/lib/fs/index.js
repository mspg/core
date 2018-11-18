const fs = require('./fs')
const mkdirp = require('./mkdirp')
const rmrf = require('./rmrf')

module.exports = {
  ...fs,
  mkdirp,
  rmrf,
}
