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

module.exports = {
  makeAbsolute,
  formatMarkdown
}
