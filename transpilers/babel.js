const babel = require('babel-core')


const path = require('path')

const conf = require('../config')()
const log = require('../log')

const BABEL =
  ({ buffer, name, resolve, reject }) => {
    const config = Object.assign(
      { basedir: conf.HTML_DIR },
      conf
    )

    const babelOptions = Object.assign(
      {},
      conf.BABEL,
      {
        filename: name,
        sourceMap: 'both',
        presets: [
          'babili',
          'es2015',
          'stage-0',
          [ 'env', {
            targets: {
              browsers: [
                'last 2 versions',
                'safari >= 7',
              ],
            },
          }],
        ],
      }
    )

    const result = babel.transform(buffer, babelOptions)

    if (!result.code) {
      reject(new Error('babel build failed'))
    }

    if (conf.ENV === 'development') {
      resolve(result.code)
      return
    }


  }

module.exports = BABEL
