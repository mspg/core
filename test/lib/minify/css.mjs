import path from 'path'

import { css } from '../../../src/lib/minify/css.js'

const cssString = `
.t, 
.t2 {
  color: green;
}
`
const expectedString = '.t,.t2{color:green;}'

const config = {
  OUT_DIR: path.join(process.cwd(), 'example', 'public'),
}

export default [{ fn: css(cssString, config), expect: expectedString, info: 'css gets minified' }]
