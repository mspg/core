#!/usr/bin/env node

const log = require('./src/log')

const tasks = require('./src/tasks')

const build = async () => {
  try {
    await tasks.build()

    await tasks.lint()

    await tasks.zip()
    
    await tasks.publish()

    log.success('build done')
  }
  catch(e) {
    throw e
  }

}

build()

module.exports = build