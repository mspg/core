const tasks = require('./tasks')

const run = async () => {
  try {
    await tasks.connect()
    
    await tasks.clean()
    await tasks.build()

    // disable until it is using csslint and htmllint instead of puglint and stylint
    // await tasks.lint()

    await tasks.zip()

    await tasks.publish()
  } catch (e) {
    throw e
  }
}

module.exports = run
