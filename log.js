const { exec } = require('child_process')
const log = (...msgs) => console.log(...msgs)

// note the double string declarations!
const red = '`tput setaf 1`'
const green = '`tput setaf 2`'
const yellow = '`tput setaf 3`'

const print = (e, stdout) => console.log(stdout)

const stringify = (...msgs) => (msgs.length === 1 ? msgs[0] : JSON.stringify(msgs))

log.success = (...msgs) => exec(`echo ${green} "${stringify(msgs)}"`, print)

log.warn = (...msgs) => exec(`echo ${yellow} "${stringify(msgs)}"`, print)

log.error = (...msgs) => exec(`echo ${red} "${stringify(msgs)}"`, print)

module.exports = log
