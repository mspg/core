const { is } = require('@magic/test')

const fs = require('../../src/lib/fs')

module.exports = [
  { fn: () => fs, expect: is.object, info: 'fs is an object' },
  { fn: () => Object.values(fs).every(is.fn), expect: true, info: 'all values of fs are functions' },
]
