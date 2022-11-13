const { parseXptTemplate } = require('../src/commands')

test('Parse input template', () => {
  const template = `
  «IF referenceExpr != null-»
  <assignment header="Reference">«referenceExpr»</assignment>
«ENDIF-»
</assign>
<jms jndiConnectionFactory="java:comp/env/jms/DashboardConnectionFactory" bytesMessage="true" timeToLive="«getDashboardMessageTimeToLive()»">
  <jndiDestination>java:comp/env/jms/DashboardQueue</jndiDestination>
</jms>
</fork>
«ENDDEFINE»

«DEFINE LogRejectedMessage(String mep, int nr, String text, String messageType, String errCode, String errMessage, String indent) FOR Environment-»
«indent»			<setMessage clearAll="true">

  `
  expect(parseXptTemplate(template)).toMatchSnapshot()

})
