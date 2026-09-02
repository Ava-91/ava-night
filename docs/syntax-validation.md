# Syntax validation matrix

Ava Night uses both TextMate token scopes and semantic token colors. The repository keeps one fixture per supported test language under `tests/syntax`, plus a combined Markdown sample for manual review in a VS Code Extension Development Host.

The fixture inventory is machine-checked by `npm run qa`. A fixture proves that the repository exercises the language; it does not claim that every language construct or language-server semantic token is covered.

| Language / file type | Fixture | Key constructs covered |
| --- | --- | --- |
| TypeScript | `typescript.ts` | interfaces, classes, generics, functions, parameters, strings, numbers |
| TSX / React | `react.tsx` | JSX, props, interfaces, handlers, template strings |
| JavaScript | `javascript.js` | regex, functions, constants, template strings |
| Python | `python.py` | imports, decorators, classes, annotations, f-strings |
| Rust | `rust.rs` | structs, enums, traits, generics, functions, macros |
| Go | `go.go` | packages, structs, interfaces, methods, constants |
| C++ | `cpp.cpp` | classes, templates, namespaces, pointers, functions |
| CSS | `css.css` | selectors, custom properties, values, pseudo-classes |
| HTML | `html.html` | tags, attributes, strings, embedded content |
| JSON | `json.json` | keys, strings, numbers, booleans, null, arrays |
| JSONC | `jsonc.jsonc` | keys, comments, strings, numbers, arrays |
| Markdown | `markdown.md` | headings, emphasis, links, inline/fenced code, quotes, lists, tables, embedded HTML |
| Shell | `shell.sh` | commands, variables, strings, substitutions, pipes |
| SQL | `sql.sql` | SELECT, identifiers, booleans, clauses, operators |
| YAML | `yaml.yaml` | keys, values, lists, booleans |

## Review checklist

For each fixture, check the same criteria:

- [ ] Keywords and control flow are distinguishable from identifiers.
- [ ] Functions and methods use the primary blue accent where semantic/syntax tokens expose them.
- [ ] Types, classes, and interfaces use the definition/gold accent.
- [ ] Strings and string-like values use the green value accent.
- [ ] Numbers/constants are distinguishable from ordinary variables.
- [ ] Comments remain muted without becoming unreadable.
- [ ] Errors and invalid constructs remain visually obvious.
- [ ] Special syntax such as regex, escapes, decorators, and annotations uses cyan appropriately.
- [ ] Markdown headings, links, emphasis, code, quotes, lists, and tables have a clear hierarchy.
- [ ] Diff/merge states distinguish added, removed, modified, current, incoming, and common regions.
- [ ] No major construct falls back to an unexpectedly unrelated color.
- [ ] Long samples remain readable without excessive visual competition.

## Automated vs visual validation

Automated validation covers JSON structure, required theme roles, palette consistency, contrast relationships, fixture inventory, tests, and VSIX packaging. The local theme inspector can also record semantic-token legends and emitted tokens for every fixture.

The `npm run vscode:smoke` check verifies that a packaged Ava Night VSIX can be installed and that VS Code can launch with the theme selected. It is a runtime smoke test, not pixel-perfect screenshot testing.

Final visual review should still be performed in VS Code for workbench layout, syntax hierarchy, Git/diff/merge rendering, and any language-specific behavior that depends on installed extensions or language servers.

## VS Code validation baseline

The extension declares `engines.vscode >= 1.100.0`. CI uses a current VS Code environment for runtime smoke validation where that workflow is enabled; the declared engine range is the compatibility floor, not a claim that every version has been manually reviewed.

When reporting a visual regression, include the VS Code version, operating system, active language extension, fixture name, and the affected theme role.
