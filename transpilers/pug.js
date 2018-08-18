// html builders
const pug = require('pug')
const htmlMinify = require('html-minifier').minify

const conf = require('../config')()
const log = require('../log')

// add pug stylus filter
pug.filters.stylus = (str, options) => {
  let ret
  str = str.replace(/\\n/g, '\n')

  style(str).render(
    (err, css) => {
      if (err) {
        throw err
      }

      ret = css.replace(/\n/g, '')
    }
  )

  return ret
}

const PUG = ({ buffer, resolve, reject }) => {
  const config = Object.assign(
    { basedir: conf.HTML_DIR },
    conf
  )

  pug.render(buffer, config, (err, html) => {
    if (err) {
      console.error(err)
      reject(err)
    }

    if (conf.ENV !== 'production') {
      resolve(html)
      return
    }

    resolve(htmlMinify(html))
  })
}

module.exports = PUG
