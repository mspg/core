#!/usr/bin/env node

const conf = require('./config')()
const log = require('./log')

const tasks = require('./tasks')

tasks.lint()
  .then(tasks.build)
  .then(tasks.zip)
  .then(tasks.publish)
  .catch(log.error)
