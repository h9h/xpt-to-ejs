const { Xpt } = require('../src/xpt-parser')
const fs = require('fs')
const path = require('path')

test('Template 1', () => {
  const template = `
«IMPORT com::tmobile::ei::sbp::mm::content::core::binding»
«IMPORT com::tmobile::ei::sbp::mm::content::core::infrastructure»

«EXTENSION extensions::esb»
«EXTENSION extensions::wsdl»

«DEFINE Root(Environment environment) FOR PortBinding»
«ENDDEFINE»

«DEFINE Root(Environment environment) FOR UsingPortBinding»
«IF !hasRESTPort(usingPort.getUsingPort()) && !isNotificationPort(usingPort) && ConnectedProvider(environment) != null»
«EXPAND Root(environment, "/consumer/", usingPort.portType, ConnectedProvider(environment))»
«ENDIF»
«ENDDEFINE»
  `

  expect(Xpt.Template.tryParse(template)).toMatchSnapshot()
})


test('Template 2', () => {
  const template = `
  «IF isAQDirect(port)-»
  <service protocol="jms" errorHandler="jmsErrorhandler" version="1" xmlns="http://www.artofarc.com/esb/service">
    <jmsBinding jndiConnectionFactory="java:comp/env/«getCFName(environment, port)»"«getWorkerPool()»>
      <queueName>«getAQDirectQueueName(port)»</queueName>
    </jmsBinding>
    <actionPipeline name="jmsErrorhandler">
      <conditional expression="contains(exception/message, 'JMS')">
        <throwException message="recoverable IO exception"/>
      </conditional>
  «EXPAND Dashboard::LogUndeliveredMessage("Request", "exception/message/text()", "if (exception/cause) then exception/cause/text() else ''", "") FOR environment-»
    </actionPipeline>
  «ELSE-»
  <service protocol="http" errorHandler="soapErrorhandler" version="1" xmlns="http://www.artofarc.com/esb/service">
    <httpBindURI«getMaxPool()»«IF port.getMTOMSupport() != null» multipartResponse="application/xop+xml"«ENDIF»>/«ESB0ServicePortAddressLocation()»</httpBindURI>
    <actionPipeline name="soapErrorhandler">
      <transform>
  «IF externalInterface.isExternalAndSOAP12()-»
        <xquery><![CDATA[<soap:Fault xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
    <soap:Code><soap:Value>soap:Receiver</soap:Value></soap:Code>
    <soap:Reason><soap:Text xml:lang="en">{exception/message/text()}</soap:Text></soap:Reason>
    <soap:Detail>{exception/cause}</soap:Detail>
  </soap:Fault>]]></xquery>
  «ELSE-»
        <xquery><![CDATA[<soapenv:Fault xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><faultcode>soapenv:Server</faultcode><faultstring>{exception/message/text()}</faultstring><detail>{exception/cause}</detail></soapenv:Fault>]]></xquery>
  «ENDIF-»
    `

    expect(Xpt.Template.tryParse(template)).toMatchSnapshot()
  })

  test('heavy nesting', () => {
    const template = `	<wsdl:message name="«message.NameX()»">
    «IF message.description != null-»
    <wsdl:documentation>«escapeXml(description)»</wsdl:documentation>
    «ENDIF-»
    «FOREACH (Collection[WSDLMessagePart])message.parts AS part -»
    <wsdl:part name="«part.NameX()»" element="tns:«part.messageType.NameX()»" />
    «ENDFOREACH -»
  </wsdl:message>
  `

  expect(Xpt.Template.tryParse(template)).toMatchSnapshot()
})

  test('Template xpt/WSDL-File-Async-Callback.xpt', () => {
    const template = fs.readFileSync(
      path.resolve(__dirname, '../xpt/WSDL-File-Async-Callback.xpt'),
      { encoding: 'utf-8' }
    )

    expect(Xpt.Template.tryParse(template)).toMatchSnapshot()
  })
