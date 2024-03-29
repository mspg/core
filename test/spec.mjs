import { is } from '@magic/test'
import config from '../src/config.js'
import localConfig from '../config.js'

export default [
  { fn: () => config(), expect: is.object, info: 'calling config returns an object' },
  {
    fn: async () => {
      const conf = await config()
      return conf.CWD
    },
    expect: is.string,
    info: 'config.CWD is a string',
  },
  {
    fn: async () => {
      const conf = await config()
      return conf.CWD
    },
    expect: localConfig.CWD,
    info: 'config.CWD equals the cwd in the cwd/config.js file',
  },
]
