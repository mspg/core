const is = require('@magic/types')
const deep = require('@magic/deep')
const hasFileChanged = require('./hasFileChanged')
const getFileType = require('./getFileType')
const log = require('@magic/log')

const conf = require('../../config')

const filterIncludes = type => k => type === getFileType(k) && k.startsWith(conf.BUNDLE_DIR)

const mapIncludesToSrc = (watchedFiles, files) => ([k, file]) => {
  const hasChanged = hasFileChanged(watchedFiles[k], file)
  if (hasChanged) {
    if (k.includes(conf.INCLUDES_DIR)) {
      if (k.includes(conf.HTML_DIR)) {
        return Object.keys(files).filter(filterIncludes('html'))
      } else if (k.includes(conf.CSS_DIR)) {
        const f = Object.keys(files).filter(filterIncludes('css'))
        return f
      } else if (k.includes(conf.JS_DIR)) {
        return Object.keys(files).filter(filterIncludes('js'))
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
    : deep.flatten(
        Object.entries(files)
          .map(mapIncludesToSrc(watchedFiles, files))
          .filter(a => a),
      )

module.exports = getChangedFiles
