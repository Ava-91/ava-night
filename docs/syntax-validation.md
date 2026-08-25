# Syntax validation matrix

Ava Night uses both TextMate token scopes and semantic token colors. The repository keeps a compact cross-language fixture at `tests/syntax-samples.md` so the theme can be reviewed consistently in a VS Code Extension Development Host.

| Language / file type | Fixture | Key constructs covered |
| --- | --- | --- |
| TypeScript | `ts` | interfaces, classes, generics, functions, parameters, strings, numbers |
| TSX / React | `tsx` | JSX, props, interfaces, handlers, template strings |
| JavaScript | `js` | regex, functions, constants, template strings |
| JSX | `jsx` | components, JSX elements, attributes |
| HTML | `html` | tags, attributes, strings, booleans |
| CSS | `css` | selectors, custom properties, values, pseudo-classes |
| JSON | `json` | keys, strings, numbers, booleans, null, arrays |
| Python | `python` | imports, decorators, classes, annotations, f-strings |
| PHP | `php` | classes, visibility, variables, return types, strings |
| C# | `csharp` | records, modifiers, types, generics, async methods |
| Java | `java` | classes, methods, generics, null values |
| Markdown | `md` | headings, emphasis, links, inline code |
| YAML | `yaml` | keys, values, lists, booleans |
| SQL | `sql` | SELECT, identifiers, booleans, clauses, operators |

## Review checklist

For each fixture, check the same criteria:

- [ ] Keywords and control flow are distinguishable from identifiers.
- [ ] Functions and methods use the primary blue accent.
- [ ] Types, classes, and interfaces use the definition/gold accent.
- [ ] Strings and string-like values use the green value accent.
- [ ] Numbers/constants are distinguishable from ordinary variables.
- [ ] Comments remain muted without becoming unreadable.
- [ ] Errors and invalid constructs remain visually obvious.
- [ ] Special syntax such as regex, escapes, decorators, and annotations uses cyan appropriately.
- [ ] No major construct falls back to an unexpectedly unrelated color.
- [ ] Long samples remain readable without excessive visual competition.

The fixture is intentionally kept in-repository so future theme changes can be reviewed against the same syntax surface instead of relying on ad-hoc screenshots.
