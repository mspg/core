module.exports = name => {
  const typeArray = name.split('.')
  const fileType = typeArray[typeArray.length - 1]
  return fileType
}