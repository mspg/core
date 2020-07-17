#!/usr/bin/env node

import run from './src/run.js'

const userWantsHelp =
  process.argv.indexOf('-h') > -1 ||
  process.argv.indexOf('--h') > -1 ||
  process.argv.indexOf('-help') > -1 ||
  process.argv.indexOf('--help') > -1 ||
  process.argv.indexOf('help') > -1

if (userWantsHelp) {
  console.log(`
    mspg - magic static page generator

    usage:
    mspg [TASKS]...

    available tasks:
    clean   - deletes the public directory
    build   - builds the src dir to public
    serve   - serves the public dir
    connect - connects the git repository to it's gh-pages branch
    publish - publishes the current HEAD to github/gitlab pages
    help    - this help text

    examples:
    production build
    NODE_ENV=production mspg clean build zip

    development (build files and serve them on 3000)
    mspg build serve
  `)
  process.exit()
}

run()
