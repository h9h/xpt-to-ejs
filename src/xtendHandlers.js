//
// Handlers for Xtend instructions
//

// --------------------------------------
// Helper functions
// --------------------------------------
const SKIP = { skip: true, result: null }

const removeTrailingMinus = s => s.charAt(s.length-1) === '-' ? s.substring(0,s.length-1) : s
const makeResult = result => ({ skip: false, result })

// template function corpus
const template = xtend => {
  if(xtend !== '') return SKIP
  if(!xtend.whatever) return SKIP
  const value = removeTrailingMinus(xtend.whatever)
  return makeResult({
    ejs: `... ${value}`,
    instruction: `... ${value}`
  })
}

// --------------------------------------
// All the concrete handlers
// --------------------------------------
const h_if = xtend => {
  if (!xtend.bedingung) return SKIP
  const value = removeTrailingMinus(xtend.bedingung)
  return makeResult({
      ejs: `<%if (${value}) {%>`,
      instruction: `Resolve "${value}"`
  })
}

const h_elseif = xtend => {
  if (!xtend.elseif) return SKIP
  const value = removeTrailingMinus(xtend.elseif)
  return makeResult({
      ejs: `<% } else { %><%if (${value}) {%>
        <%# TODO: add another closing block at next ENDIF %>`,
      instruction: `[ELSEIF] CAUTION: Need to add a second closing tag "<% } %>" at next ENDIF!
      && Resolve "${value}"`
  })
}

const h_else = xtend => {
  if(xtend !== 'ELSE') return SKIP
  return makeResult({
    ejs: '<% } else { %>',
  })
}

const h_endif = xtend => {
  if(xtend !== 'ENDIF') return SKIP
  return makeResult({
    ejs: '<% } /* end-if */ %>',
  })
}

const h_import = xtend => {
  if(!xtend.import) return SKIP
  const value = removeTrailingMinus(xtend.import)
  return makeResult({
    ejs: `// Import: ${value}`,
    instruction: `[IMPORT] '${value}' - check adaptation`
  })
}

const h_extension = xtend => {
  if(!xtend.extension) return SKIP
  const value = removeTrailingMinus(xtend.extension)
  return makeResult({
    ejs: `<% include('${value}') %>`,
    instruction: `[EXTENSION] Included script '${value}' - check existence and name`
  })
}

const h_expand = xtend => {
  if(!xtend.expand) return SKIP
  const value = removeTrailingMinus(xtend.expand)

  let template = value
  let args = ''
  let comment = ''

  if (value.indexOf('(') > -1) {
    const start = value.indexOf('(')
    const ende = value.lastIndexOf(')')
    if (ende > start) {
      template = value.substring(0, start)
      args = `, { args: [${value.substring(start+1, ende)}] }`
    }
    if (ende < value.length-1) {
      comment = ` and skipped tail: "${value.substring(ende)}"`
    }
  }
  return makeResult({
    ejs: `<%- include('${template}'${args}') %>`,
    instruction: `[EXPAND] Included template '${value}' - check resolution${comment}`
  })
}

const h_file = xtend => {
  if(!xtend.file) return SKIP
  const value = removeTrailingMinus(xtend.file)
  return makeResult({
    ejs: `<%# TODO: File Handling
    write file '${value}'
    %>'`,
    instruction: `[FILE] Handle creation of file '${value}'`
  })
}
const h_endfile = xtend => {
  if(xtend !== 'ENDIF') return SKIP
  return makeResult({
    ejs: '<%# TODO: End of File Handling %>',
  })
}

const h_let = xtend => {
  if(!xtend.let) return SKIP
  const value = removeTrailingMinus(xtend.let)
  try {
    const [expression, variable] = value.split(" AS ")
    return makeResult({
      ejs: `<% { const ${variable} = ${expression} %>`,
      instruction: `[LET] Handle variable definition: ${value}`
    })
  } catch (e) {
    return makeResult({
      ejs: `<%# TODO: LET "${value}" %><% { %>`,
      instruction: `[LET] Unresolved variable definition: ${value}`
    })
  }
}
const h_endlet = xtend => {
  if(xtend !== 'ENDLET') return SKIP
  return makeResult({
    ejs: '<% } /* end-let */ %>',
  })
}

const h_define = xtend => {
  if(!xtend.define) return SKIP
  const value = removeTrailingMinus(xtend.define)
  try {
    const [expression, variable] = value.split(" FOR ")
    return makeResult({
      ejs: `<%# TODO: DEFINE Method "${variable}" on type "${expression}" %><% { %>}`,
      instruction: `[DEFINE] Handle method definition: ${value}`
    })
  } catch (e) {
    return makeResult({
      ejs: `<%# TODO: DEFINE Method "${value}" %><% { %>`,
      instruction: `[DEFINE] Unresolved method definition: ${value}`
    })
  }
}
const h_enddefine = xtend => {
  if(xtend !== 'ENDDEFINE') return SKIP
  return makeResult({
    ejs: '<% } /* end-define */ %>',
  })
}

const h_foreach = xtend => {
  if(!xtend.forEach) return SKIP
  const value = removeTrailingMinus(xtend.forEach)
  try {
    const [expression, variable] = value.split(" AS ")
    return makeResult({
      ejs: `<% ${expression}.forEach(${variable} => { %>`,
      instruction: `[FOREACH] Handle foreach definition: ${value}`
    })
  } catch (e) {
    return makeResult({
      ejs: `<%# TODO: FOREACH "${value}" %><% { %>`,
      instruction: `[FOREACH] Unresolved foreach definition: ${value}`
    })
  }
}
const h_endforeach = xtend => {
  if(xtend !== 'ENDFOREACH') return SKIP
  return makeResult({
    ejs: '<% } /* end-forEach */ %>',
  })
}

const h_error = xtend => {
  if(!xtend.error) return SKIP
  const value = removeTrailingMinus(xtend.error)
  return makeResult({
    ejs: `<% throw '${value}' %>`,
    instruction: `[ERROR] Handle ${value}`
  })
}

const h_rem = xtend => {
  if(xtend !== 'REM') return SKIP
  return makeResult({
    ejs: `<%#`,
  })
}
const h_endrem = xtend => {
  if(xtend !== 'ENDREM') return SKIP
  return makeResult({
    ejs: '%>',
  })
}

const h_indent = xtend => {
  if(xtend !== 'indent') return SKIP
  return makeResult({
    ejs: '',
  })
}

const h_substitution = xtend => {
  if(!xtend.substitution) return SKIP
  const value = removeTrailingMinus(xtend.substitution)
  return makeResult({
    ejs: `<%-${value}%>`,
    instruction: `[SUBSTITUTION] Check "${value}"`
  })
}

// --------------------------------------
// Collect und export Handlers
// --------------------------------------
const XtendHandlers = [
  h_if,
  h_elseif,
  h_else,
  h_endif,
  h_import,
  h_extension,
  h_expand,
  h_file,
  h_let,
  h_endlet,
  h_define,
  h_enddefine,
  h_foreach,
  h_endforeach,
  h_error,
  h_rem,
  h_endrem,
  h_indent,
  h_substitution
]

module.exports = {
  XtendHandlers
}
