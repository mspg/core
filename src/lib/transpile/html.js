const addTrailingSlash = require('../addTrailingSlash')
const config = require('../../config')

const { WEB_ROOT } = config

const transpileOpenRegex = /"\s*{\s*{\s*/gim
const transpileCloseRegex = /\s*}\s*}\s*/gim

const transpileHTML = html =>
  html
    .replace(transpileOpenRegex, '"{{')
    .replace(transpileCloseRegex, '}}')
    .replace(/\s*{\s*{\s*WEB_ROOT\s*}\s*}\s*/gim, addTrailingSlash(WEB_ROOT))

module.exports = transpileHTML