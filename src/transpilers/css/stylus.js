const util = require('util')
const path = require('path')

// css builders
const stylus = require('stylus')
const nib = require('nib')
const autoprefixer = require('autoprefixer-stylus')
const cssnano = require('cssnano')
// const stylint = require('stylint')

const conf = require('../../config')()

cssnano.process = util.promisify(cssnano.process)

// stylus build task
const style = string =>
  stylus(string)
    .set('paths', [conf.CSS_DIR])
    .set('sourcemap', {})
    .use(nib())
    .use(autoprefixer())
    .import(path.join(conf.CSS_DIR, 'variables'))

const promisedRender = (string) => new Promise(( resolve, reject) => 
  style(string)
    .render((err, css) => err ? reject(err) : resolve(css))
)

const promisedNano = (css) => new Promise((resolve, reject) => 
  console.log('nano', css) || cssnano.process(css)
    .then(result => {
      console.log({ result })
      resolve(result.css)
    })
    .catch(reject)
)

const TRANSPILE_CSS = async ({ buffer, name, resolve, reject }) => {
  const string = buffer.toString()

  try {
    let css = await promisedRender(string)
    // 'minify' the css output
    return css
      // replace newlines after commas to get multiple css classes onto one line
      .replace(/,\n/gmi, ', ')
      // replace all whitespaces with one space per whitespace group (\n\t\n === ' ').
      .replace(/\s\s+/gmi, ' ')
      // replace newlines before } to get all declarations onto one line
      .replace(/\n}/gmi, '}')
  }
  catch(e) {
    throw e
  }
}

module.exports = TRANSPILE_CSS
