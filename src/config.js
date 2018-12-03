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
config.WATCH = argv.includes('watch')
config.SERVE = argv.includes('serve')
config.GIT_ORIGIN = 'origin'
config.GIT_BRANCH = 'gh-pages'
config.IGNORE_EXTENSIONS = []
config.VERBOSE = argv.includes('verbose')

const LINT = config.LINT || { 
  HTML: false,
  CSS: false,
}

config.LINT = {
  HTML: LINT.HTML || argv.includes('lint') && argv.includes('html'),
  CSS: LINT.CSS || argv.includes('lint') && argv.includes('css'),
}

config.TASKS = {
  CLEAN: argv.includes('clean') || config.ENV === 'production',
  BUILD: argv.includes('build'),
  LINT: argv.includes('lint'),
  PUBLISH: argv.includes('publish'),
  ZIP: argv.includes('zip'),
  CONNECT: argv.includes('connect'),
}

config.MINIFY = {
  HTML: require('./lib/minify/html'),
  CSS: require('./lib/minify/css'),
}

module.exports = config
