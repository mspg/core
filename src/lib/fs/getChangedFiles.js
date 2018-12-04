const is = require('@magic/types')
const hasFileChanged = require('./hasFileChanged')

const getChangedFiles = (watchedFiles, files) =>
  is.empty(watchedFiles)
    ? Object.keys(files)
    : Object.entries(files)
        .filter(hasFileChanged(watchedFiles))
        .map(([k]) => k)

module.exports = getChangedFiles
