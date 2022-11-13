const { XtendHandlers } = require('./xtendHandlers')

/**
 * Takes an AST and generates ejs
 *
 * @param {*} ast The Object containing the parse result
 *    [
 *      { XtendInstruction: "..." | {...} },
 *      { TemplateText: "..." }
 *    ]
 * @return { ejs = "...", instructions = [...], error = [...] }
 */
const generateEjs = ast => {
  let ejs = ''
  let instructions = []
  let error = []

  try {
    ast.forEach(element => {
      if (element.TemplateText) {
        ejs += element.TemplateText
      } else if (element.XtendInstruction) {
        const result = xtendHandler(element.XtendInstruction)
        if (result.error) {
          error.push(result.error)
        } else {
          ejs += result.ejs
          if (result.instruction) instructions.push(result.instruction)
        }
      }
    })

  } catch (e) {
    error.push(e)
  }

  return { ejs, instructions, error }
}

const xtendHandler = xtend => {
  let resolution = { error: `not handled: ${JSON.stringify(xtend)}` }

  XtendHandlers.every(handler => {
    const {skip, result} = handler(xtend)
    if (!skip) resolution = result
    return skip
  })

  return resolution
}

module.exports = {
  generateEjs
}
