const getFileType = require('./getFileType')

const contentTypes = {
  css: 'text/css',
  js: 'application/javascript',
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  zip: 'application/zip',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odt: 'application/vnd.oasis.opendocument.text',
  mpeg: 'audio/mpeg',
  mpg: 'audio/mpg',
  ogg: 'audio/ogg',
  csv: 'text/csv',
  text: 'text/plain',
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  gif: 'image/gif',
}

const getContentType = req => {
  const fileType = getFileType(req.url)
  let contentType = 'text/plain'
  if (contentTypes[fileType]) {
    contentType = contentTypes[fileType]
  }

  return contentType
}

module.exports = getContentType