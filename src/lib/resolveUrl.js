import path from 'path'
import fs from '@magic/fs'

const resolveUrl = async (req, conf) => {
  const { OUT_DIR } = conf

  const file = path.join(OUT_DIR, req.url)

  if (path.resolve(file) === path.resolve(OUT_DIR)) {
    //index.html is the default resolve for /
    return path.join(OUT_DIR, 'index.html')
  }

  try {
    // file exists
    if (await fs.exists(file)) {
      const stat = await fs.stat(file)
      if (stat.isFile()) {
        return file
      }
    }

    // file exists as html, /about loads /about.html
    if (await fs.exists(`${file}.html`)) {
      return `${file}.html`
    }

    // file exists as index.html and file is a directory.
    const f = path.join(file, 'index.html')
    if (await fs.exists(f)) {
      return f
    }
  } catch (e) {
    throw e
  }

  return false
}

export default resolveUrl
