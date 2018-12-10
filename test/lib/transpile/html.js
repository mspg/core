const { is, tryCatch } = require('@magic/test')
const transpileHTML = require('../../../src/lib/transpile/html')
const { WEB_ROOT } = require('../../../src/config')
const addTrailingSlash = require('../../../src/lib/addTrailingSlash')

module.exports = [
  { fn: transpileHTML(''), expect: is.string, info: 'returns string even with empty string' },
  {
    fn: tryCatch(transpileHTML, null),
    expect: is.error,
    info: 'errors on invalid html string argument',
  },
  {
    fn: transpileHTML('" { { WEB_ROOT } } "'),
    expect: t => t.startsWith('"/') && t.endsWith('/"'),
    info: 'correctly transforms {{WEB_ROOT}}',
  },
  {
    fn: transpileHTML('" { { WEB_ROOT } } "'),
    expect: t => t.includes(WEB_ROOT),
    info: 'correctly transforms {{WEB_ROOT}}',
  },
]
