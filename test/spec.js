const { is } = require('@magic/test')
const config = require('../src/config')

module.exports = [
  { fn: () => config, expect: is.object, info: 'calling config returns an object' },
]
