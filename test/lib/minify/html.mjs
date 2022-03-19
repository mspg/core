import { html } from '../../../src/lib/minify/html.js'

const htmlString = `
<div id="i" class="c">
  content
</div>
`
const expectedString = '<div id="i" class="c"> content</div>'

export default [{ fn: html(htmlString), expect: expectedString, info: 'html gets minified' }]
