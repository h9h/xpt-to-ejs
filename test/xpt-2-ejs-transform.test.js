const { generateEjs } = require('../src/generateEjs')
const { Xpt } = require('../src/xpt-parser')
const fs = require('fs')
const path = require('path')

test('Template xpt/WSDL-File-Async-Callback.xpt', () => {
  const template = fs.readFileSync(
    path.resolve(__dirname, '../xpt/WSDL-File-Async-Callback.xpt'),
    { encoding: 'utf-8' }
  )

  const ast = Xpt.Template.tryParse(template)
  const ejs = generateEjs(ast)

  expect(ejs).toMatchSnapshot()
})

/*
test('Template xpt/esb0/Dashboard.xpt', () => {
  const template = fs.readFileSync(
    path.resolve(__dirname, '../xpt/esb0/Dashboard.xpt'),
    { encoding: 'utf-8' }
  )

  expect(Xpt.Template.tryParse(template)).toMatchSnapshot()
})
*/
