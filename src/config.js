const fs = require('fs')
const path = require('path')

const { argv } = process

// config variables
const defaultConfig = {}
defaultConfig.CWD = process.cwd()
defaultConfig.SRC_DIR = defaultConfig.CWD
defaultConfig.ENV = process.env.NODE_ENV || 'development'
defaultConfig.BUILD_DIR = path.join(defaultConfig.SRC_DIR, 'build')
defaultConfig.INCLUDES_DIR = path.join(defaultConfig.SRC_DIR, 'includes')
defaultConfig.BUNDLE_DIR = path.join(defaultConfig.SRC_DIR, 'src')
defaultConfig.OUT_DIR = path.join(defaultConfig.CWD, 'public')
defaultConfig.CSS_DIR = path.join(defaultConfig.INCLUDES_DIR, 'css')
defaultConfig.HTML_DIR = path.join(defaultConfig.INCLUDES_DIR, 'html')
defaultConfig.JS_DIR = path.join(defaultConfig.INCLUDES_DIR, 'js')
defaultConfig.WATCH = argv.indexOf('noWatch') < 0
defaultConfig.SERVE = argv.indexOf('noServe') < 0
defaultConfig.GIT_ORIGIN = 'origin'
defaultConfig.GIT_BRANCH = 'gh-pages'

defaultConfig.LINT = {
  HTML: argv.indexOf('html') > -1,
  CSS: argv.indexOf('css') > -1,
}

defaultConfig.TASKS = {
  BUILD: argv.indexOf('build') > -1,
  LINT: argv.indexOf('lint') > -1,
  PUBLISH: argv.indexOf('publish') > -1,
  ZIP: argv.indexOf('zip') > -1,
}

const configPath = path.join(defaultConfig.CWD, 'config.js')

const config = () =>
  fs.existsSync(configPath) ? Object.assign(defaultConfig, require(configPath)) : defaultConfig

module.exports = config
