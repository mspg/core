const getFileType = name => {
  if (!name || !name.includes('.')) {
    return 'txt'
  }
  const typeArray = name.split('.')
  return typeArray[typeArray.length - 1]
}

module.exports = getFileType
