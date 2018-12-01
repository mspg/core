const { is } = require('@magic/test')

const getFileType = require('../../src/lib/getFileType')
const contentTypes = Object.entries(require('../../src/lib/contentTypes'))

module.exports = [
  {
    fn: contentTypes.filter(
      ([ext, type]) => {
        return ext !== getFileType(`file.${ext}`)
      }
    ),
    expect: is.empty,
    info: 'getFileType handles all defined contentTypes correctly',
  },
  {
    fn: getFileType('file.unknown'),
    expect: 'unknown',
    info: 'unknown content returns extension'
  }
]
