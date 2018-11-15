const fs = require('fs')
const path = require('path')

const { argv } = process

const cwd = process.cwd()
const configPath = path.join(cwd, 'config.js')
let config = {}
if (fs.existsSync(configPath)) {
  config = require(configPath)
}

// config variables
config.CWD = config.CWD || process.cwd()
config.ENV = process.env.NODE_ENV || 'development'
config.BUILD_DIR = path.join(config.CWD, 'build')
config.INCLUDES_DIR = path.join(config.CWD, 'includes')
config.BUNDLE_DIR = path.join(config.CWD, 'src')
config.OUT_DIR = path.join(config.CWD, 'public')
config.CSS_DIR = path.join(config.INCLUDES_DIR, 'css')
config.HTML_DIR = path.join(config.INCLUDES_DIR, 'html')
config.JS_DIR = path.join(config.INCLUDES_DIR, 'js')
config.WATCH = argv.indexOf('watch') > -1
config.SERVE = argv.indexOf('serve') > -1
config.GIT_ORIGIN = 'origin'
config.GIT_BRANCH = 'gh-pages'
config.IGNORE_EXTENSIONS = []
config.VERBOSE = argv.indexOf('verbose') > -1

config.LINT = {
  HTML: argv.indexOf('html') > -1,
  CSS: argv.indexOf('css') > -1,
}

config.TASKS = {
  BUILD: argv.indexOf('build') > -1,
  LINT: argv.indexOf('lint') > -1,
  PUBLISH: argv.indexOf('publish') > -1,
  ZIP: argv.indexOf('zip') > -1,
  CONNECT: argv.indexOf('connect') > -1,
}

module.exports = config
