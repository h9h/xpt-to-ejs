const { Xpt } = require("./xpt-parser");

const parseXptTemplate = (source) => Xpt.Template.tryParse(source)

module.exports = {
  parseXptTemplate
}
