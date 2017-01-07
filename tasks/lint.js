const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')
const stylint = require('stylint')

const conf = require('../config')()
const log = require('../log')

const lintHtml =
  () =>
    new Promise((resolve, reject) => {
      if (!conf.LINT.HTML) {
        resolve()
        return
      }

      const executable = path.join('node_modules', '.bin', 'pug-lint')
      const config = path.join(conf.BUILD_DIR, 'pug-lintrc.js')
      const filesToLint = [
        path.join(conf.BUNDLE_DIR, '*.html'),
        path.join(conf.INCLUDES_DIR, 'html', '*.pug'),
      ].join(' ')

      const cmd = `${ executable } --config ${ config } ${ filesToLint }`

      exec(cmd,
        (err, res) => {
          if (err) {
            reject(err)
          }

          log('pug-lint results:', res)
          resolve()
        }
      )
    })

const lintCss =
  () =>
    new Promise((resolve, reject) => {
      if (!conf.LINT.CSS) {
        resolve()
        return
      }

      const executable = path.join('node_modules', '.bin', 'stylint')

      const configPath = path.join(__dirname, 'config', '.stylintrc')
      const filesToLint = [
        path.join(conf.BUNDLE_DIR, '*.css'),
        path.join(conf.INCLUDES_DIR, 'css'),
      ]

      let timesReturned = 0

      filesToLint.forEach(
        dir => {
          const cmd = `${ executable } --config ${ configPath } ${ dir }`

          // console.log('exec :', cmd)

          const exe = exec(cmd,
            (err, stdout) => {
              if (err) {
                reject(err)
                return
              }
              log('stylint results:', stdout)

              timesReturned += 1
              if (timesReturned >= filesToLint.length) {
                log('stylint finished')
                resolve()
              }
            }
          )
        }
      )
    })

const lint =
  () =>
    new Promise((resolve, reject) => {
      if (!conf.LINT.HTML && !conf.LINT.CSS) {
        resolve()
        return
      }

      return lintHtml()
        .then(lintCss)
        .then(() => log('Linting completed'))
        .then(resolve)
        .catch(reject)
    })

module.exports = lint
