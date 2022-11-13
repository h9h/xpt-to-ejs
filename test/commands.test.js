const { transformFile } = require('../src/commands')

test('Transform input template', () => {
  const o = transformFile('a', { outdir: './generated' })
  expect(o).toEqual({})

})
