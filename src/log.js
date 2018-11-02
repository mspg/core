const log = (...msgs) => console.log(...msgs)

log.success = (...msgs) => console.log('SUCCESS', ...msgs)

log.warn = (...msgs) => console.log('WARN', ...msgs)

log.error = (...msgs) => console.log('ERROR', ...msgs)

module.exports = log
