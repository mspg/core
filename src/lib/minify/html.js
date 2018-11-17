module.exports = html =>
  html
    // replace newlines after tags with nothin
    .replace(/\>\n/gim, '>')
    // replace all whitespaces with one space per whitespace group (\n\t\n === ' ').
    .replace(/\s\s+/gim, ' ')
    // replace whitespaces beween tags or in empty tags with nothing
    .replace(/>\s+</gim, '><')
    // remove newlines before closing tags
    .replace(/\n<\//gim, '</')
    .trim()
