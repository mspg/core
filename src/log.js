const conf = require('./config.js')()

const log = (...msgs) => console.log(...msgs)

log.success = (...msgs) => console.log('SUCCESS', ...msgs)

log.warn = (...msgs) => console.log('WARN', ...msgs)

log.error = (...msgs) => console.log('ERROR', ...msgs)

log.info = (...msgs) => conf.VERBOSE && console.log('INFO', ...msgs)

module.exports = log
