const is = require('@magic/types')
const deep = require('@magic/deep')
const hasFileChanged = require('./hasFileChanged')
const getFileType = require('./getFileType')

const conf = require('../../config')

const mapIncludesToSrc = (watchedFiles, files) => ([k, file]) => {
  if (hasFileChanged(watchedFiles[k], file)) {
    if (k.includes(conf.INCLUDES_DIR)) {
      if (k.includes(conf.HTML_DIR)) {
        return Object.keys(files).filter(f => !getFileType(f) !== 'html')
      } else if (k.includes(conf.CSS_DIR)) {
        return Object.keys(files).filter(f => !getFileType(f) !== 'css')
      } else if (k.includes(conf.JS_DIR)) {
        return Object.keys(files).filter(f => !getFileType(f) !== 'js')
      } else {
        log.error('Unknown File type in fs.getChangedFiles')
      }
    }

    return k
  }
}

const getChangedFiles = (watchedFiles, files) =>
  is.empty(watchedFiles)
    ? Object.keys(files)
    : deep.flatten(Object.entries(files)
        .map(mapIncludesToSrc(watchedFiles, files))
        .filter(a => a))

module.exports = getChangedFiles
