const getFileType = require('./getFileType')
const contentTypes = require('./contentTypes')

const getContentType = req => {
  const fileType = getFileType(req.url)
  let contentType = 'text/plain'
  if (contentTypes[fileType]) {
    contentType = contentTypes[fileType]
  }

  return contentType
}

module.exports = getContentType
