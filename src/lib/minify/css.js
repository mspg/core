const purify = require('purify-css')
const path = require('path')

const minify = style =>
  style
    // replace newlines after commas to get multiple css classes onto one line
    .replace(/,\n/gim, ',')
    // replace all whitespaces with one space per whitespace group (\n\t\n === ' ').
    .replace(/\s\s+/gim, ' ')
    // replace newlines before } to get all declarations onto one line
    .replace(/\n}/gim, '}')
    // remove spaces around opening brackets {
    .replace(/\s{\s+/gim, '{')
    // remove spaces after :
    .replace(/:\s/gim, ':')
    // remove spaces after ;
    .replace(/;\s/gim, ';')
    // remove spaces after ,
    .replace(/,\s/gim, ',')
    .trim()

module.exports = (style, config = { OUT_DIR: process.cwd() }) => {
  if (!config.PURGE_CSS) {
    return minify(style)
  }

  const OUT_DIR = config.OUT_DIR || process.cwd()
  const content = [path.join(OUT_DIR, '**/*.js'), path.join(OUT_DIR, '**/*.html')]

  const purified = purify(content, style)

  const minified = minify(purified)
  return minified
}
