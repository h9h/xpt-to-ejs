const fs = require('fs')
const path = require('path')

const { Xpt } = require("./xpt-parser")
const { generateEjs } = require("./generateEjs")
const { makeAbsolute, formatMarkdown, getEncoding } = require("../helper")

// Default options
const transformOptions = {
  out:              './gen',
  overwrite:        true,
  templateEncoding: 'utf-8',
  haltOnError:      true,
}

const abort = message => {
  console.log(`

  ===== Aborting on error: ${message}

  `)
  process.exit(9)
}

const makeOutFilename = (filename, out, ext) => {
  const name = path.basename(filename, 'xpt') + ext
  return path.join(out, name)
}

/**
 * Transforms an Xtend/Xpand Template  into an EJS Template and migration-instructions
 *
 * @param {string} filename - the filename of the file to transform
 * @param {object} options see {@link transformOptions}
 */
const transformFile    = (filename, options) => {
  const opts = { ...transformOptions, ...options }

  const f = makeAbsolute(filename)
  if (!fs.existsSync(f)) {
    abort(`File "${f}" not found`)
  }

  console.log(`    reading template ${f}`)
  const template = fs.readFileSync(f, { encoding: opts.templateEncoding })
  if(template.indexOf('«') < 0) {
    console.log(`    Read file, didn't find any "«" - saved in wrong encoding?`)
    console.log('    ---------------------------------------------------------')
    console.log('    Beginning of file:')
    console.log(template.substring(0, 80))
  }
  console.log(`    parsing template`)
  const ast = Xpt.Template.tryParse(template)
  console.log(`    generating ejs`)
  const { ejs, error, instructions } = generateEjs(ast)

  if (error.length > 0) {
    console.log(`
    Dumping Errors
    ==============
    `)
    error.forEach(e => console.error(e))
    if (opts.haltOnError) {
      abort('Errors on generating ejs')
    }
  }

  const ejsFile = makeOutFilename(f, opts.out, 'ejs')
  const outgendir = path.dirname(ejsFile)
  if (!fs.existsSync(outgendir)) {
    console.log(`Creating directory ${outgendir}`)
    fs.mkdirSync(outgendir, { recursive: true })
  }

  if (!opts.overwrite && filename.existsSync(ejsFile)) {
    abort(`Generated file "${ejsFile}" already exists`)
  }
  console.log(`    Writing ejs file "${ejsFile}"`)
  fs.writeFileSync(ejsFile, ejs, { flag: 'w', encoding: 'utf8' })

  const mdFile = makeOutFilename(f, opts.out, 'md')
  if (!opts.overwrite && filename.existsSync(ejsFile)) {
    abort(`    Generated file "${mdFile}" already exists`)
  }
  console.log(`    Writing instructions file "${mdFile}"`)
  fs.writeFileSync(mdFile, formatMarkdown(instructions, filename, ejsFile), { flag: 'w', encoding: 'utf8' })
}

const transformDir = (dirname, options) => {
  const d = makeAbsolute(dirname)
  if (!fs.existsSync(d)) {
    abort(`Directory "${d}" not found`)
  }

  const walkSync = (dir) => {
    console.log(`Walking directory ${dir}`)
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filepath = path.join(dir, file);
      const stats = fs.statSync(filepath);
      if (stats.isDirectory()) {
        walkSync(filepath);
      } else if (stats.isFile() && path.extname(filepath) === '.xpt') {
        const relativeDir = path.dirname(path.relative(dirname, filepath))
        const enc = getEncoding(filepath)
        console.log(filepath, enc)
        transformFile(filepath, {
          ...options,
          out: path.join(options.out, relativeDir),
          templateEncoding: enc || options.templateEncoding
        })
      }
    })
  }

  walkSync(d)
}

module.exports = {
  transformFile,
  transformDir,
  transformOptions,
}
