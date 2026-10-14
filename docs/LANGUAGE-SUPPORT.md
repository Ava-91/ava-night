# Language support

Ava Night defines TextMate token scopes and semantic-token colors. The appearance of an identifier depends on the grammar and language server active in a user's VS Code installation.

| Language | Repository fixture | Notes |
| --- | --- | --- |
| TypeScript / TSX | Yes | Syntax scopes and common semantic roles |
| JavaScript | Yes | Syntax scopes and common semantic roles |
| Python | Yes | Semantic roles depend on the selected language server |
| Rust | Yes | Semantic roles depend on rust-analyzer configuration |
| Go / C++ | Yes | Grammar and language-server contributions may differ |
| CSS / HTML / JSON / JSONC | Yes | Primarily grammar-driven highlighting |
| Markdown / Shell / SQL / YAML | Yes | Grammar scopes vary by language support extension |

A fixture means representative source code exists for review. It does **not** guarantee every token receives a particular color in every VS Code installation.

## Reviewing language support

1. Open the repository in VS Code and run the project checks described in [the development guide](../DEVELOPMENT.md).
2. Open representative fixtures in `tests/syntax/` with the language extensions and language servers you normally use.
3. Inspect the semantic tokens supplied by your active providers using the local inspector documented in `tools/theme-inspector/README.md`.
4. Review the theme with semantic highlighting enabled and disabled.
5. If a token looks wrong, report the language, theme edition, token role, and the relevant grammar scope or semantic token type when available.

For visual regression review, use `npm run screenshots` when the installed VS Code build supports the capture command. Otherwise, use the manual review checklist in [Accessibility and visual quality](accessibility.md) and record screenshots from the editor.

## Important caveat

Themes assign colors to scopes and token types; they do not implement language parsing. If a language server does not emit a semantic token, or a grammar uses a different scope, the theme cannot reliably style that token by the role you expected.
