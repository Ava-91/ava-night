# Language support

The theme provides TextMate token scopes and semantic-token colors. The appearance of a particular identifier depends on the grammar and language server active in the user's VS Code installation.

| Language | Fixture in repository | Notes |
| --- | --- | --- |
| TypeScript / TSX | Yes | Syntax and common semantic roles |
| JavaScript | Yes | Syntax and common semantic roles |
| Python | Yes | Semantic roles depend on the selected Python language server |
| Rust | Yes | Semantic roles depend on rust-analyzer configuration |
| Go / C++ | Yes | Grammar and server contributions may differ |
| CSS / HTML / JSON / JSONC | Yes | Primarily grammar-driven highlighting |
| Markdown / Shell / SQL / YAML | Yes | Grammar scopes vary by extension |

A fixture means the repository contains representative source code for review. It does **not** mean every token is guaranteed to receive a particular color in every VS Code installation.

## Inspecting semantic tokens

Open the repository in VS Code, install the local inspector under `tools/theme-inspector`, and run **Ava Night: Inspect Theme**. The output at `tests/results/semantic-tokens.json` records the language IDs and semantic token types emitted by the active providers.

For a regression review, capture screenshots with `npm run screenshots` after packaging the extension. If the installed VS Code binary does not support the screenshot CLI option, use the manual checklist in [Accessibility](ACCESSIBILITY.md) and record screenshots from the editor itself.
