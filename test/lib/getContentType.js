const { is } = require('@magic/test')

const getContentType = require('../../src/lib/getContentType')
const contentTypes = Object.entries(require('../../src/lib/contentTypes'))

module.exports = [
  {
    fn: contentTypes.filter(
      ([ext, type]) => contentTypes[ext] === getContentType({ url: `file.${ext}` }),
    ),
    expect: is.empty,
    info: 'getContentType handles all defined contentTypes correctly',
  },
]
