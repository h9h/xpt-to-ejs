# Xpand/Xtend to ejs

## Patterns

```
«IF bedingung -»  ==   <%if (bedingung) {%>
«ELSE-» == <% } else { %>
«ENDIF-» == <% } %>
«Variable/Funktion» == <%-Variable/Funktion%>
«EXPAND template(args)» == <%- include('template', {args: [args]}); %>
«IMPORT ...» == // ...
«EXTENSION ext» == <% include('ext') %>
«FILE filespec» => außerhalb von Template abbilden
«LET expr AS variable» == <% {const variable = expr %>
«ENDLET» == <% } %>
«FOREACH liste AS listenelement» == <% liste.forEach(listenelement => { %>
«ENDFOREACH-» == <% }) %>
«ERROR string» == <% throw 'string' %>
```
More Xtend instructions:

REM/ENDREM - Comments

## Grammar

