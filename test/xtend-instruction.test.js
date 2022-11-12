const { Xpt } = require('../src/xpt-parser')

test('Command «IF»', () => {
  expect(Xpt.XtendIf.tryParse('IF bedingung1 & bed2'))
    .toEqual({bedingung: "bedingung1 & bed2"})
})

test('Command «IF» ohne Bedingung', () => {
  try {
    expect(Xpt.XtendIf.tryParse('IF '))
    .toThrow()
  } catch (e) {}
})

test('Command long «IF»', () => {
  expect(Xpt.XtendIf.tryParse('IF !hasRESTPort(usingPort.getUsingPort()) && !isNotificationPort(usingPort) && ConnectedProvider(environment) != null'))
  .toEqual({
    bedingung: "!hasRESTPort(usingPort.getUsingPort()) && !isNotificationPort(usingPort) && ConnectedProvider(environment) != null"
  })
})


test('Command «IMPORT»', () => {
  expect(Xpt.XtendImport.tryParse('IMPORT com::tmobile::ei::sbp::mm::content::core::infrastructure'))
    .toEqual({import: "com::tmobile::ei::sbp::mm::content::core::infrastructure"})
})

test('IMPORT Doesnt slurp »', () => {
  try {
    expect(Xpt.XtendImport.tryParse('IMPORT com::tmobile::ei::sbp::mm::content::core::infrastructure»'))
    .toThrow()
  } catch (e) {}
})

test('Command «EXPAND-»', () => {
  expect(Xpt.XtendExpand.tryParse('EXPAND Root(environment, "/provider/", providingPort.portType, null)'))
    .toEqual({expand: "Root(environment, \"/provider/\", providingPort.portType, null)"})
})

test('Command EXTENSION-»', () => {
  expect(Xpt.XtendExtension.tryParse('EXTENSION extensions::esb'))
    .toEqual({"extension": "extensions::esb"})
})

test('Command FILE-»', () => {
  expect(Xpt.XtendFile.tryParse('FILE artefactsDir(environment) + xqFile'))
    .toEqual({file: "artefactsDir(environment) + xqFile"})
})

test('Command «LET-»', () => {
  expect(Xpt.XtendLet.tryParse('LET getTransformationResourceFileName(port, operation, role) + ".xq" AS xqFile'))
    .toEqual({let: "getTransformationResourceFileName(port, operation, role) + \".xq\" AS xqFile"})
})
