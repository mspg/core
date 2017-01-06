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

      console.log('lint html')

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

      log('lint css')

      const executable = path.join('node_modules', '.bin', 'stylint')

      const configPath = path.join(conf.BUILD_DIR, '.stylintrc')
      const filesToLint = [
        path.join(conf.BUNDLE_DIR, '*.css'),
        path.join(conf.INCLUDES_DIR, 'css'),
      ]

      filesToLint.forEach(
        dir => {
          if (!fs.existsSync(dir)) {
            return
          }

          const cmd = `${ executable } --config ${ configPath } ${ dir }`

          console.log('exec :', cmd)

          const exe = exec(cmd,
            (err, stdout) => {
              if (err) {
                reject(err)
                return
              }
              log('stylint results:', stdout)
              resolve()
            }
          )
        }
      )
    })

const lint =
  () => {
    if (!conf.LINT.HTML && !conf.LINT.CSS) {
      return
    }

    return lintHtml()
      .then(lintCss)
      .then(() => log('Linting completed'))
      .catch(log.error)
  }

module.exports = lint
