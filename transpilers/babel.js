const babel = require('babel-core')

// const path = require('path')

const conf = require('../config')()
// const log = require('../log')

const BABEL = ({ buffer, name, resolve, reject }) => {
  const config = Object.assign(
    { basedir: conf.HTML_DIR },
    conf
  )

  const babelOptions = Object.assign(
    {},
    config.BABEL,
    {
      filename: name,
      sourceMap: 'both',
      presets: [
        'minify',
        'env',
        'stage-0',
        [ 'env', {
          targets: {
            browsers: [
              'last 2 versions',
              'safari >= 7'
            ]
          }
        }]
      ]
    }
  )

  const result = babel.transform(buffer, babelOptions)

  if (!result.code) {
    reject(new Error('babel build failed'))
  }

  if (config.ENV === 'development') {
    resolve(result.code)
  }
}

module.exports = BABEL
