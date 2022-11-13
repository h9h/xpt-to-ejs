#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { transformOptions } = require('./src/commands')
const { makeAbsolute } = require('./helper')
const { transformFile, transformDir } = require('./src/commands')

const argv = yargs(hideBin(process.argv))
  .usage('Usage: -f <filename> [options]')
  .example('$0 template.xpt -o false')
  .alias('f', 'filename')
  .describe('f', 'The filename to the file, that is to be transformed')
  .alias('d', 'directory')
  .describe('d', 'The directory containing the files, that are to be transformed')
  .conflicts('f', 'd')
  .check((argv) => {
		if (!argv.f && !argv.d) {
			throw new Error('You must supply either filename or directory');
		} else {
			return true;
		}
	})
  .alias('o', 'out')
  .describe('o', 'Output directory')
  .default('o', makeAbsolute(transformOptions.out))
  .boolean('overwrite')
  .describe('overwrite', 'Overwrite generated files')
  .default('overwrite', transformOptions.overwrite)
  .boolean('haltOnError')
  .describe('haltOnError', 'Exit on error')
  .default('haltOnError', transformOptions.haltOnError)
  .describe('templateEncoding', 'Encoding of input files')
  .default('templateEncoding', transformOptions.templateEncoding)
  .help()
  .alias('h', 'help')
  .wrap(80)
  .argv

const init = argv.out ? { out: makeAbsolute(argv.out) } : {}

const options = ['overwrite', 'haltOnError', 'templateEncoding'].reduce((o, arg) => {
  if (argv[arg]) {
    o[arg] = argv[arg]
  }
  return o
}, init)

console.log(options)

if (argv.f) {
  transformFile(argv.filename, options)
}

if (argv.d) {
  transformDir(argv.directory, options)
}
