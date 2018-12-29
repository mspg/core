const { is, tryCatch } = require('@magic/test')
const transpileHTML = require('../../../src/lib/transpile/html')
const { WEB_ROOT } = require('../../../src/config')
const addTrailingSlash = require('../../../src/lib/addTrailingSlash')

module.exports = [
  { fn: tryCatch(transpileHTML, { buffer: '' }), expect: is.error, info: 'returns error with invalid buffer' },
  {
    fn: tryCatch(transpileHTML, null),
    expect: is.error,
    info: 'errors on invalid html string argument',
  },
  {
    fn: transpileHTML({ name: '/deep/index.html', buffer: '" { { WEB_ROOT } } "' }),
    expect: t => t.startsWith('"/') && t.endsWith('/"'),
    info: 'correctly transforms {{WEB_ROOT}}',
  },
  {
    fn: transpileHTML({ name: '/index.html', buffer: '" { { WEB_ROOT } } "' }),
    expect: t => t.includes(WEB_ROOT),
    info: 'correctly transforms {{WEB_ROOT}}',
  },
  {
    fn: transpileHTML({ name: '/testing/dir/file.html', buffer: '" { { DIR } } "' }),
    expect: t => t.includes('"/testing/dir/"'),
    info: 'correctly transforms {{DIR}}',
  },
  {
    fn: '" { { test'.replace(transpileHTML.regex.open, '{{'),
    expect: '"{{test',
    info: 'replaces spaces between opening brackets',
  },
  {
    fn: ' " { { test'.replace(transpileHTML.regex.open, '{{'),
    expect: ' "{{test',
    info: 'does not replace spaces before first "',
  },
  {
    fn: 'test } } '.replace(transpileHTML.regex.close, '}}'),
    expect: 'test}}',
    info: 'replaces spaces between closing brackets',
  },
  {
    fn: 'test } } " '.replace(transpileHTML.regex.close, '}}'),
    expect: 'test}}" ',
    info: 'does not replace spaces before last "',
  },
]
