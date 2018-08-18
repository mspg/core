#!/usr/bin/env node

const log = require('./src/log')

const tasks = require('./src/tasks')

tasks
  .lint()
  .then(tasks.build)
  .then(tasks.zip)
  .then(tasks.publish)
  .catch(log.error)
