const hasFileChanged = (watched, file) => !watched || !watched.time || file.time > watched.time

export default hasFileChanged
