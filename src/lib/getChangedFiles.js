import is from '@magic/types'
import deep from '@magic/deep'
import fs from '@magic/fs'
import log from '@magic/log'

import hasFileChanged from './hasFileChanged.js'

const filterIncludes = (type, conf) => k =>
  type === fs.getFileType(k) && k.startsWith(conf.BUNDLE_DIR)

const mapIncludesToSrc = (watchedFiles, files, conf) => ([k, file]) => {
  const hasChanged = hasFileChanged(watchedFiles[k], file)

  if (hasChanged) {
    if (k.includes(conf.INCLUDES_DIR)) {
      if (k.includes(conf.HTML_DIR)) {
        return Object.keys(files).filter(filterIncludes('html', conf))
      } else if (k.includes(conf.CSS_DIR)) {
        const f = Object.keys(files).filter(filterIncludes('css', conf))
        return f
      } else if (k.includes(conf.JS_DIR)) {
        return Object.keys(files).filter(filterIncludes('js', conf))
      } else {
        log.error('Unknown File type in fs.getChangedFiles')
      }
    }

    return k
  }
}

const getChangedFiles = async (watchedFiles, files, conf) => {
  return is.empty(watchedFiles)
    ? Object.entries(files)
    : deep.flatten(
        Object.entries(files)
          .map(mapIncludesToSrc(watchedFiles, files, conf))
          .filter(a => a),
      )
}

export default getChangedFiles
