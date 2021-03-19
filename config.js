import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const cwd = process.cwd()

export default {
  // files get loaded from example/src and example/includes
  CWD: path.join(cwd, 'example'),
  // and published in example/publish
  OUT_DIR: 'docs',
  // root of the homepage, useful if you are using username.github.io/repo style urls.
  // trailing slash gets added if missing
  WEB_ROOT: '/core',
}
