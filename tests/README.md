# Ava Night Theme Test Matrix

These fixtures are visual QA inputs for Ava Night. They are intentionally written to exercise syntax and semantic-token roles rather than to function as application code.

## How to use

1. Open this repository in VS Code.
2. Select **Ava Night** as the active color theme.
3. Open the fixture for the language you want to inspect.
4. Make sure semantic highlighting is enabled (`editor.semanticHighlighting.enabled`).
5. Check the syntax hierarchy, semantic tokens, comments, literals, operators, punctuation, embedded languages, and error states.
6. Record unexpected rendering in the relevant GitHub issue before changing the theme.

## Matrix

| Fixture | Language / format | Main coverage |
|---|---|---|
| `javascript.js` | JavaScript | functions, classes, async, regex, template literals, imports |
| `typescript.ts` | TypeScript | interfaces, generics, decorators, types, enums, overloads |
| `react.tsx` | TSX / React | JSX, components, props, hooks, generics, events |
| `python.py` | Python | decorators, classes, comprehensions, typing, exceptions |
| `html.html` | HTML | elements, attributes, entities, embedded JS/CSS |
| `css.css` | CSS | selectors, properties, variables, functions, media queries |
| `json.json` | JSON | objects, arrays, keys, strings, numbers, booleans, null |
| `jsonc.jsonc` | JSON with Comments | comments, keys, arrays, nested configuration |
| `markdown.md` | Markdown | headings, links, emphasis, lists, tasks, tables, code, quotes |
| `yaml.yaml` | YAML | mappings, sequences, anchors, strings, booleans, numbers |
| `shell.sh` | Shell | variables, functions, conditionals, command substitution, pipes |
| `sql.sql` | SQL | keywords, identifiers, strings, functions, joins, CTEs |
| `rust.rs` | Rust | structs, traits, enums, generics, lifetimes, macros, async |
| `go.go` | Go | structs, interfaces, methods, goroutines, channels, generics |
| `cpp.cpp` | C++ | templates, classes, namespaces, pointers, lambdas, macros |

## Validation checklist

For every fixture, inspect:

- [ ] Comments and documentation comments
- [ ] Keywords and control flow
- [ ] Types / classes / interfaces / enums
- [ ] Functions and methods
- [ ] Variables / properties / parameters
- [ ] Strings and template/interpolated strings
- [ ] Numbers and constants
- [ ] Regular expressions where supported
- [ ] Operators and punctuation
- [ ] Imports / modules / namespaces
- [ ] Errors or invalid syntax where intentionally included
- [ ] Nested or embedded syntax where applicable

The fixtures are reusable release-test inputs. Update this matrix when language support is added or materially changed.