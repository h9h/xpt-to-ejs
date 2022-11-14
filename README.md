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

- REM/ENDREM - Comments

## Grammar

[Xpand Reference](https://git.eclipse.org/c/m2t/org.eclipse.xpand.git/plain/doc/org.eclipse.xpand.doc/manual/xpand_reference.pdf)

## Usage


See 

```
node x2e.js
```

```
Usage: -f <filename> [options]

Options:
      --version           Show version number                          [boolean]
  -f, --filename          The filename to the file, that is to be transformed
  -d, --directory         The directory containing the files, that are to be
                          transformed
  -o, --out               Output directory        [default: "<current dir>/gen"]
      --overwrite         Overwrite generated files    [boolean] [default: true]
      --haltOnError       Exit on error                [boolean] [default: true]
  -h, --help              Show help                                    [boolean]

Examples:
  x2e.js template.xpt -o false

You must supply either filename or directory
```
