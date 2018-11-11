const { is } = require('@magic/test')
const config = require('../src/config')

module.exports = [
  { fn: () => config, expect: is.function, info: 'config exports a function' },
  { fn: () => config(), expect: is.object, info: 'calling config returns an object' },
]
