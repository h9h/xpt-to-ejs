const P = require('parsimmon')

const _ = P.optWhitespace

const Xpt = P.createLanguage({
  // Symbols
  OpenFrench:   () => P.string('«'),
  CloseFrench:  () => P.alt(P.string('-»'), P.string('»')).map(b => b == '»'),

  // Keywords
  IF:           () => P.string('IF').trim(_),
  ELSE:         () => P.string('ELSE'),
  ENDIF:        () => P.string('ENDIF'),
  EXPAND:       () => P.string('EXPAND'),
  IMPORT:       () => P.string('IMPORT'),
  EXTENSION:    () => P.string('EXTENSION'),
  DEFINE:       () => P.string('DEFINE'),
  ENDDEFINE:    () => P.string('ENDDEFINE'),
  FOR:          () => P.string('FOR'),
  FOREACH:      () => P.string('FOREACH'),
  ENDFOREACH:   () => P.string('ENDFOREACH'),
  LET:          () => P.string('LET'),
  ENDLET:       () => P.string('ENDLET'),
  ERROR:        () => P.string('ERROR'),
  FILE:         () => P.string('FILE'),
  ENDFILE:      () => P.string('ENDFILE'),
  REM:          () => P.string('REM'),
  ENDREM:       () => P.string('ENDREM'),
  INDENT:       () => P.string('indent'),

  // Parts
  TextInFrench: r => P.regexp(/[^»]+/).trim(_),
  TemplateText: () => P.seqObj(
    ['template text', P.regexp(/[^«»]+/)]
  ),


  // ---------------------------------
  // Xtend Instructions
  // ---------------------------------

  // «IF getMessageStandard(externalInterface) != MessageStandard::INSTANCE_XML-»
  XtendIf:      r => P.seqObj(
      r.IF,
      ['bedingung', r.TextInFrench],
    ),
  XtendElse:    r => r.ELSE,
  XtendEndif:   r => r.ENDIF,

  // «IMPORT com::tmobile::ei::sbp::mm::content::core::infrastructure»
  XtendImport:  r => P.seqObj(
    r.IMPORT,
    ['import', r.TextInFrench],
  ),

  // «EXPAND Dashboard::LogUndeliveredMessage("Request",
  //    "exception/message/text()",
  //    "if (exception/cause) then exception/cause/text() else ''", "") FOR environment-»
  XtendExpand:  r => P.seqObj(
    r.EXPAND,
    ['expand', r.TextInFrench]
  ),

  // «EXTENSION extensions::esb»
  XtendExtension: r => P.seqObj(
    r.EXTENSION,
    ['extension', r.TextInFrench],
  ),

  // «FILE XServiceRef(port, environment, relDir) + ".xservice"»
  XtendFile:     r => P.seqObj(
    r.FILE,
    ['file', r.TextInFrench],
  ),
  XtendEndFile:  r => r.ENDFILE,

  // «LET getPrivateServiceSignaturePortAdapter(port) AS externalInterface»
  XtendLet:       r => P.seqObj(
    r.LET,
    ['let', r.TextInFrench]
  ),
  XtendEndlet:  r => r.ENDLET,

  // «FOREACH port.getAllowedOperations().reject(e|e.messageExchangePattern
  //    == MessageExchangePattern::SYNC_REQ_REP && isAQDirect(port)) AS operation-»
  XtendForEach:  r => P.seqObj(
    r.FOREACH,
    ['forEach', r.TextInFrench]
  ),
  XtendEndForEach: r => r.ENDFOREACH,

  // «ERROR "PortAdapter type not supported: " + this»
  XtendError:    r => P.seqObj(
    r.ERROR,
    ['error', r.TextInFrench]
  ),

  // «DEFINE Root(Environment environment) FOR ProvidingPortBinding»
  XtendDefine:    r => P.seqObj(
    r.DEFINE,
    ['define', r.TextInFrench]
  ),
  XtendEndDefine:     r => r.ENDDEFINE,

  // «LET getPrivateServiceSignaturePortAdapter(port) AS externalInterface»
  XtendRem:       r => P.seqObj(
    r.REM,
    ['remark', r.TextInFrench]
  ),
  XtendEndRem:  r => r.ENDREM,
  XtendIndent:  r => r.INDENT,

  // «getRequestHeaderElements(portBinding.port, operation).first().localPart
  XtendSubstitution:  r => P.seqObj(
    ['substitution', r.TextInFrench]
  ),

  // ---------------------------------
  // any Xtend Instruction
  // ---------------------------------
  XtendInstruction: r => P.seqObj(
    r.OpenFrench,
    ['XtendInstruction', P.alt(
      r.XtendIf,
      r.XtendElse,
      r.XtendEndif,
      r.XtendImport,
      r.XtendExpand,
      r.XtendExtension,
      r.XtendFile,
      r.XtendLet,
      r.XtendEndlet,
      r.XtendForEach,
      r.XtendEndForEach,
      r.XtendError,
      r.XtendDefine,
      r.XtendEndDefine,
      r.XtendRem,
      r.XtendEndRem,
      r.XtendIndent,
      // least specific --> last parser option
      r.XtendSubstitution,
    )],
    r.CloseFrench
  ),

  // ---------------------------------
  // Das Template setzt sich aus Xtend-Anweisungen und Template-Text zusammen
  // ---------------------------------
  Instruction: r => P.alt(
    r.XtendInstruction,
    r.TemplateText,
  ),
  Template:   r => r.Instruction.atLeast(1).trim(_)
})

module.exports = { Xpt }
