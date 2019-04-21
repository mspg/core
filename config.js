const path = require('path')

module.exports = {
  // files get loaded from example/src and example/includes
  CWD: path.join(__dirname, 'example'),
  // and published in example/publish
  OUT_DIR: 'docs',
  // root of the homepage, useful if you are using username.github.io/repo style urls.
  // trailing slash gets added if missing
  WEB_ROOT: '/core',
}
