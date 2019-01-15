const tasks = require('./tasks')

const run = async () => {
  try {
    await tasks.resizeImages()

    // connects this installation to github/gitlab remote
    await tasks.connect()

    // delete public dir
    await tasks.clean()

    // build html/css/js and other files, run transpiler plugins
    await tasks.build()

    // disable until using csslint and htmllint instead of puglint and stylint
    // await tasks.lint()

    // use zopfli to compress files
    await tasks.zip()

    // publish public/ dir to github/gitlab
    await tasks.publish()
  } catch (e) {
    throw e
  }
}

module.exports = run
