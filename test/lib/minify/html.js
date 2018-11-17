const minify = require('../../../src/lib/minify/html.js')

const htmlString = `
<div id="i" class="c">
  content
</div>
`
const expectedString = '<div id="i" class="c"> content</div>'

module.exports = [{ fn: minify(htmlString), expect: expectedString, info: 'html gets minified' }]
