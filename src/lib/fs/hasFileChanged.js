const hasFileChanged = watchedFiles => ([k, t]) =>
  t && watchedFiles[k] && t.time > watchedFiles[k].time

module.exports = hasFileChanged
