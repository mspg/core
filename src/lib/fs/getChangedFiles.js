const is = require('@magic/types')
const hasFileChanged = require('./hasFileChanged')

const getChangedFiles = (watchedFiles, files) => {
  if (is.empty(watchedFiles)) {
    return Object.keys(files)
  }

  return Object.entries(files)
    .filter(([k, file]) => hasFileChanged(watchedFiles[k], file))
    .map(([k]) => k)
}

module.exports = getChangedFiles
