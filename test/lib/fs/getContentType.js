const { is } = require('@magic/test')

const { getContentType, contentTypes } = require('../../../src/lib/fs')

module.exports = [
  {
    fn: Object.entries(contentTypes).filter(
      ([ext, type]) => type !== getContentType({ url: `file.${ext}` }),
    ),
    expect: is.empty,
    info: 'getContentType handles all defined contentTypes correctly',
  },
  {
    fn: getContentType({ url: 'file.unknown' }),
    expect: 'text/plain',
    info: 'unknown content returns text/plain',
  },
]
