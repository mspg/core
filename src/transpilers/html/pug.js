const util = require('util')
// html builders
const pug = require('pug')
const htmlMinify = require('html-minifier').minify
// const style = require('../css/stylus')

const conf = require('../../config')()
// const log = require('../log')

const render = util.promisify(pug.render)

// add pug stylus filter
// pug.filters.stylus = async (str, options) => {
//   try {
//     return await style({ buffer: str, name: 'test' })
//   }
//   catch(e) {
//     throw e
//   }
// }

const PUG = async ({ buffer }) => {
  const config = Object.assign({ basedir: conf.HTML_DIR }, conf)

  try {
    const html = await render(buffer, config)

    const minified = await htmlMinify(html)
  
    return minified
  }
  catch(e) {
    throw e
  }
}

module.exports = PUG
