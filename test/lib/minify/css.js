const minify = require('../../../src/lib/minify/css.js')

const cssString = `
.t, 
.t2 {
  color: green;
}
`
const expectedString = '.t,.t2{color:green;}'

module.exports = [
  { fn: minify(cssString), expect: expectedString, info: 'css gets minified' },
]