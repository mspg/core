#!/usr/bin/env node

const log = require('@magic/log')

const tasks = require('./src/tasks')

const build = async () => {
  try {
    await tasks.build()

    // disable until it is using csslint and htmllint
    // await tasks.lint()

    await tasks.zip()

    await tasks.publish()

    log.success('build done')
  } catch (e) {
    throw e
  }
}

build()

module.exports = build
