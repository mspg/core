const fs = require('./fs')

module.exports = {
  ...fs,
  mkdirp: require('./mkdirp'),
  rmrf: require('./rmrf'),
  getFiles: require('./getFiles'),
  getFileContent: require('./getFileContent'),
  getChangedFiles: require('./getChangedFiles'),
  hasFileChanged: require('./hasFileChanged'),
  contentTypes: require('./contentTypes'),
  getFileType: require('./getFileType'),
  getContentType: require('./getContentType'),
  write: require('./write'),
  rm: require('./rm'),
}
