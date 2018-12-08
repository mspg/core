### mspg - magic static page generator

[![NPM version][npm-image]][npm-url]
[![Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/mspg/core.svg)](https://greenkeeper.io/)

transforms a src directory into a github hosted gh-pages branch.

##### installation
```
npm i --save mspg/core
```

##### usage
mspg comes as a single executable file.
```
mspg [TASKS]...

available tasks:
clean   - deletes the public directory
build   - builds the src dir to public
serve   - serves the public dir
zip     - gzips the public dir using zopfli
connect - connects the git repository to it's gh-pages branch
publish - publishes the current HEAD to github/gitlab pages
help    - this help text
```

##### cli usage examples:
```
# production build
NODE_ENV=production mspg clean build zip 
  
# development (build files, watch for changes, and serve them on localhost:3000)
mspg build serve watch
```

##### example app
a minimal example app is in the [example][example-url] directory of this repository,
using [config.js][config-url] from the root directory

##### example app on github.io
the example app is published to the [gh-pages][gh-pages] branch.
it is hosted @ [https://mspg.github.io/core][page-url]

##### using html/css/javascript transpilation
writing transpilers for any kind of toolchain is pretty easy,
just have a look at the examples below to get started if you want to use another toolchain.
every transpiler also includes a minimal example project in the example directory.

###### html
both html toolchains below follow the same rules:
* every *.html file in the src/ directory is a page and gets transpiled to public/
* every includes/html/*.extension file is an include file and can be included using /filename.extension
* every includes/html/*.extension file can also be a template file. using extend you can reuse a html template in both pug and posthtml. 

* [pug](https://github.com/mspg/transpile-pug)
* [posthtml](https://github.com/mspg/transpile-posthtml)

###### css
* [stylus](https://github.com/mspg/transpile-stylus)
* postcss - soon

###### js
* [babel](https://github.com/mspg/transpile-babel)
* rollup - soon

[npm-image]: https://img.shields.io/npm/v/@mspg/core.svg
[npm-url]: https://www.npmjs.com/package/@mspg/core
[travis-image]: https://travis-ci.com/mspg/core.svg?branch=master
[travis-url]: https://travis-ci.org/mspg/core
[appveyor-image]: https://ci.appveyor.com/api/projects/status/ksffectdrx0ekfb8?svg=true
[appveyor-url]: https://ci.appveyor.com/project/jaeh/core/branch/master
[coveralls-image]: https://coveralls.io/repos/github/mspg/core/badge.svg
[coveralls-url]: https://coveralls.io/github/mspg/core
[example-url]: https://github.com/mspg/core/tree/master/example
[config-url]: https://github.com/mspg/core/blob/master/config.js
[gh-pages]: https://github.com/mspg/core/tree/gh-pages
[page-url]: https://mspg.github.io/core
