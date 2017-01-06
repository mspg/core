#!/usr/bin/env node
const { isFunction } = require('magic-types')
const conf = require('./config')()
const log = require('./log')

const tasks = require('./tasks')

const maybeLint =
  () =>
    new Promise((resolve, reject) => {
      if (!conf.TASKS.LINT) {
        resolve()
      }
      tasks.lint()
        .then(resolve)
        .catch(reject)
    })

if (conf.TASKS.BUILD) {
  log('start build, config: \n', conf)

  maybeLint()
    .then(tasks.build)
    .then(() => console.log('build finished'))
    .then(
      () => conf.TASKS.ZIP && tasks.zip()
    )
    .then(() => console.log('zip finished'))
    .then(
      () => conf.TASKS.PUBLISH && tasks.publish()
    )
    .then(() => console.log('publish finished'))
    .catch(log.error)
}
