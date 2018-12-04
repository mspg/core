const hasFileChanged = (watched, file) =>
  !watched || !watched.time || file.time > watched.time

module.exports = hasFileChanged
