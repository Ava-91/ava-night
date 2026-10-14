# Language support

Ava Night is designed as a **language-agnostic VS Code color theme**. It uses common TextMate scope families plus VS Code semantic-token roles rather than depending on one framework or language. This gives it useful baseline syntax highlighting across many language extensions, including languages that do not have a dedicated repository fixture.

## Coverage strategy

| Language family / workflow | Representative fixtures | What the fixture exercises |
| --- | --- | --- |
| Core application languages | TypeScript, TSX, JavaScript, Python, Rust, Go, C++, Java, C#, Kotlin, Swift, Dart | Keywords, types, functions, parameters, strings, literals, variables, and control flow |
| Dynamic and scripting languages | Ruby, PHP, Lua, R, Julia, Perl, PowerShell | Dynamic variables, interpolation, functions, symbols, constants, and control flow |
| Functional / JVM languages | Scala, Haskell, Elixir, Clojure, OCaml, Groovy | Type declarations, pattern matching, modules, functions, and operators |
| Web components and frameworks | HTML, CSS, Vue, Svelte, Astro | Tags, attributes, embedded JavaScript/TypeScript, styles, and template expressions |
| Data, configuration, and markup | JSON, JSONC, YAML, TOML, INI, Markdown, LaTeX | Keys, values, strings, comments, headings, markup, and configuration syntax |
| Infrastructure and build tooling | Shell, Dockerfile, Terraform/HCL, Makefile | Variables, commands, interpolation, configuration blocks, and build rules |
| Query, API, and schema languages | SQL, GraphQL, Protocol Buffers | Keywords, names, fields, types, and schema declarations |
| Systems / specialized languages | Solidity, Zig, plus existing C/C++ and Rust fixtures | Types, declarations, literals, functions, and operators |
| Review artifacts | Diff | Added/removed lines and patch syntax |

The fixture directory is a review suite, not a list of languages that VS Code officially supports by itself. VS Code's language support often comes from extensions; install the relevant extension to see its grammar and semantic tokens.

## How the theme provides broad coverage

- **TextMate fallback scopes** cover common syntax roles such as comments, strings, numeric and language constants, keywords, types, functions, variables, tags, markup, and invalid syntax.
- **Additional scope aliases** cover frequently used grammar conventions for namespaces, interfaces, structs, traits, decorators, annotations, template strings, regular expressions, object keys, parameters, and embedded-language boundaries.
- **Semantic tokens** cover common language-server roles such as functions, methods, classes, interfaces, types, enums, properties, parameters, variables, namespaces, decorators, macros, and comments.
- **Workbench colors** are language-independent, so editor surfaces, selections, diagnostics, terminal colors, diffs, and focus states remain themed regardless of file type.

## Reviewing language support

1. Install the VS Code extension that provides syntax grammar or language-server support for the language.
2. Open its representative fixture in `tests/syntax/` and select each Ava Night edition.
3. Review semantic highlighting both enabled and disabled.
4. Check comments, strings, numeric constants, keywords, types, functions, properties, parameters, decorators, embedded regions, and invalid syntax.
5. If an extension's grammar uses an unusual scope, report the language, theme edition, extension name, token/scope, and a screenshot if possible.

Run the project checks described in [the development guide](../DEVELOPMENT.md). Automated fixtures confirm that examples are present; they do not prove that every language server emits identical tokens or that every extension's custom grammar has been visually tested.

## Important limitation

No color theme can guarantee individually tuned highlighting for **every language that can be edited in VS Code**. VS Code supports a large extension ecosystem, and extensions can define arbitrary TextMate scopes, semantic-token types, embedded languages, or custom webviews. Ava Night aims to provide sensible fallback colors for standard and commonly used scopes. A language or extension that introduces novel scopes may need a targeted rule after it is reported and tested.
