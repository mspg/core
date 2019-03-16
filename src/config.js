const fs = require('fs')
const path = require('path')

const { argv } = process

const cwd = process.cwd()
const configPath = path.join(cwd, 'config.js')
let config = {}
if (fs.existsSync(configPath)) {
  config = require(configPath)
}

const maybePrefixPath = (p, CWD) => {
  if (!p.startsWith(CWD)) {
    p = path.join(CWD, p)
  }

  return p
}

// config variables
config.ENV = process.env.NODE_ENV || 'development'

config.CWD = config.CWD || process.cwd()

config.BUILD_DIR = maybePrefixPath(config.BUILD_DIR || 'build', config.CWD)
config.INCLUDES_DIR = maybePrefixPath(config.INCLUDES_DIR || 'includes', config.CWD)
config.BUNDLE_DIR = maybePrefixPath(config.BUNDLE_DIR || 'src', config.CWD)
config.OUT_DIR = config.OUT_DIR || path.join(config.CWD, 'public')
config.CSS_DIR = maybePrefixPath(config.CSS_DIR || 'css', config.INCLUDES_DIR)
config.HTML_DIR = maybePrefixPath(config.HTML_DIR || 'html', config.INCLUDES_DIR)
config.JS_DIR = maybePrefixPath(config.JS_DIR || 'js', config.INCLUDES_DIR)

config.WATCH = argv.includes('watch')
config.SERVE = argv.includes('serve')

config.GIT_ORIGIN = 'origin'
config.GIT_BRANCH = 'gh-pages'

config.IGNORE_EXTENSIONS = []
config.VERBOSE = argv.includes('verbose')


config.IMAGE_EXTENSIONS = ['gif', 'jpg', 'jpeg', 'png', 'webp', 'jp2']
config.MAX_IMAGE_WIDTH = config.MAX_IMAGE_WIDTH || 2000
config.MAX_IMAGE_HEIGHT = config.MAX_IMAGE_HEIGHT || 2000
config.IMAGE_QUALITY = config.IMAGE_QUALITY || 90

config.TASKS = {
  CLEAN: argv.includes('clean') || (config.ENV === 'production' && argv.includes('build')),
  BUILD: argv.includes('build'),
  LINT: argv.includes('lint'),
  PUBLISH: argv.includes('publish'),
  ZIP: argv.includes('zip'),
  CONNECT: argv.includes('connect'),
  SERVE: argv.includes('serve'),
  RESIZE_IMAGES: argv.includes('resize-images'),
}

config.MINIFY = {
  HTML: require('./lib/minify/html'),
  CSS: require('./lib/minify/css'),
}

const WEB_ROOT = config.WEB_ROOT || '/'
config.WEB_ROOT = config.ENV === 'production' ? WEB_ROOT : '/'

config.ZIP_EXTENSIONS = ['html', 'css', 'js', 'json', 'xml', 'text', 'csv', 'txt']

module.exports = config
