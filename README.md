### mspg - magic static page generator

[![NPM version][npm-image]][npm-url]
[![Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]

transforms a src directory into a github hosted gh-pages branch.

###### installation
```
npm i --save mspg/core
```

###### usage
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

##### usage examples:
```
# production build
NODE_ENV=production mspg clean build zip 
  
# development (build files and serve them on 3000)
mspg build serve
```

###### example app
a minimal example app is in the [example][example-url] directory of this repository,
using [config.js][config-url] from the root directory

###### example app on github.io
the example app is published to the [gh-pages][gh-pages] branch.
it is hosted @ [https://mspg.github.io/core][page-url]

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
