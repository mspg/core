const { is } = require('@magic/test')
const config = require('../src/config')
const localConfig = require('../config')

module.exports = [
  { fn: () => config, expect: is.object, info: 'calling config returns an object' },
  { fn: () => config.CWD, expect: is.string, info: 'config.CWD is a string' },
  {
    fn: () => config.CWD,
    expect: localConfig.CWD,
    info: 'config.CWD equals the cwd in the cwd/config.js file',
  },
]
