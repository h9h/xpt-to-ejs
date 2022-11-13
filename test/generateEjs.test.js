const { generateEjs } = require('../src/generateEjs')

test('just if', () => {
  const ast = [
    {
      "XtendInstruction": {
        "bedingung": "referenceExpr != null-",
      },
    },
  ]

  expect(generateEjs(ast)).toEqual({
    ejs: "<%if (referenceExpr != nul) {%>",
    error: [],
    instructions: ['Resolve "referenceExpr != nul"']
  })
})

test('just expand', () => {
  const ast = [{
    XtendInstruction: {
      expand: 'Root(environment, "consumer", usingPort.portType, ConnectedProvider(environment))',
    },
  }]

  expect(generateEjs(ast)).toEqual({
    ejs: "<%- include('Root', { args: [environment, \"consumer\", usingPort.portType, ConnectedProvider(environment)] }') %>",
    error: [],
    instructions: ["[EXPAND] Included template 'Root(environment, \"consumer\", usingPort.portType, ConnectedProvider(environment))' - check resolution"]
  })
})

test('generate ejs', () => {
  const ast = [
    {
      "XtendInstruction": {
        "bedingung": "referenceExpr != null-",
      },
    },
    {
      "TemplateText": `
    <assignment header="Reference">`,
    },
    {
      "XtendInstruction": {
        "substitution": "referenceExpr",
      },
    },
    {
      "TemplateText": `</assignment>
      `,
    },
    {
      "XtendInstruction": "ENDIF",
    },
    {
      "TemplateText": `
  </assign>
  <jms jndiConnectionFactory="java:comp/env/jms/DashboardConnectionFactory" bytesMessage="true" timeToLive="`,
    },
    {
      "XtendInstruction": {
        "substitution": "getDashboardMessageTimeToLive()",
      },
    },
    {
      "TemplateText": `">
    <jndiDestination>java:comp/env/jms/DashboardQueue</jndiDestination>
  </jms>
  </fork>
  `,
    },
    {
      "XtendInstruction": "ENDDEFINE",
    }]

  expect(generateEjs(ast)).toMatchSnapshot()
})