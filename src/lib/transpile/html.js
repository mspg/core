import path from 'path'

import is from '@magic/types'

import addTrailingSlash from '../addTrailingSlash.js'

const transpileOpenRegex = /\s*{\s*{\s*/gim
const transpileCloseRegex = /\s*}\s*}\s*/gim

const transpileHTML = async (props, config) => {
  const { WEB_ROOT, BUNDLE_DIR } = config

  if (!is.object(props) || !props.buffer || !props.name) {
    throw new Error('Invalid props in transpileHTML')
  }

  const { name, buffer } = props

  const cleanedDir = path.dirname(name).replace(BUNDLE_DIR, WEB_ROOT).replace(/\/\//gm, '/')

  const DIR = addTrailingSlash(cleanedDir)

  const transpiled = buffer
    .replace(transpileOpenRegex, '{{')
    .replace(transpileCloseRegex, '}}')
    .replace(/\s*{\s*{\s*WEB_ROOT\s*}\s*}\s*/gm, addTrailingSlash(WEB_ROOT))
    .replace(/\s*{\s*{\s*CWD\s*}\s*}\s*/gm, addTrailingSlash(WEB_ROOT))
    .replace(/\s*{\s*{\s*DIR\s*}\s*}\s*/gm, DIR)

  return transpiled
}

transpileHTML.regex = {
  open: transpileOpenRegex,
  close: transpileCloseRegex,
}

export default transpileHTML
