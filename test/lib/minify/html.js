import minify from '../../../src/lib/minify/html.js'

const htmlString = `
<div id="i" class="c">
  content
</div>
`
const expectedString = '<div id="i" class="c"> content</div>'

export default [{ fn: minify(htmlString), expect: expectedString, info: 'html gets minified' }]
