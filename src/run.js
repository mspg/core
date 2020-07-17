import getConfig from './config.js'
import * as tasks from './tasks/index.js'

const run = async () => {
  const config = await getConfig()
  try {
    // connects this installation to github/gitlab remote
    await tasks.connect(config)

    // delete public dir
    await tasks.clean(config)

    // build html/css/js and other files, run transpiler plugins
    await tasks.build(config)

    // disable until using csslint and htmllint instead of puglint and stylint
    // await tasks.lint(config)

    // use zopfli to compress files
    // await tasks.zip(config)

    // publish public/ dir to github/gitlab
    await tasks.publish(config)
  } catch (e) {
    throw e
  }
}

export default run
