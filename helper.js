const fs = require('fs')
const path = require('path')

const makeAbsolute = filename => path.isAbsolute(filename) ? filename : path.resolve(__dirname, filename)

const formatMarkdown = (instructions, source, target) => {
  return `# Nacharbeiten

    Quelle: ${source}
    Ziel:   ${target}

    ## Zu prüfende Punkte:

    ${instructions.map(i => `[ ] ${i}
    `).join('')}
  `
}

const getEncoding = filename => {
  let encoding = ''
  const encodings = ['utf-8', 'latin1', 'utf16le'].filter(enc => {
    const content = fs.readFileSync(filename, { encoding: enc })
    if (content.indexOf('«') > -1) {
      return true
    }
    return false
  })

  if (encodings.length < 1) return null
  return encodings[0]
}

module.exports = {
  makeAbsolute,
  formatMarkdown,
  getEncoding
}
