import is from '@magic/types'
import fs from '@magic/fs'

const minifyFile = async (file, conf) => {
  const { name, bundle } = file

  const type = fs.getFileType(name)

  const minifier = conf.MINIFY && conf.MINIFY[type.toLowerCase()]

  if (is.function(minifier)) {
    const minified = minifier(bundle, conf)
    return minified
  }

  return file.bundle
}

export default minifyFile
