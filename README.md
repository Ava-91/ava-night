<div align="center">

# 🌙 Ava Night

### Where code meets the quiet of midnight

A calm, midnight Visual Studio Code theme family built around **focus, readable contrast, and meaningful color**.

![Ava Night preview](.github/assets/hero.png)

[![Version](https://img.shields.io/badge/version-1.3.0-61AFEF?style=flat-square)](https://github.com/Ava-91/ava-night/releases)
[![License](https://img.shields.io/badge/license-MIT-98C379?style=flat-square)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-theme-7FDBFF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![CI](https://github.com/Ava-91/ava-night/actions/workflows/ci.yml/badge.svg)](https://github.com/Ava-91/ava-night/actions/workflows/ci.yml)

**Calm • Focused • Readable • Midnight**

</div>

---

## ✨ Pick your atmosphere

| Edition | Character |
| --- | --- |
| **Ava Night** | Deep midnight navy, electric blue, icy cyan, lavender, and mint |
| **Ava Night — Moonlit** | Cooler blue-green surfaces with clear icy highlights |
| **Ava Night — Eclipse** | Plum-black surfaces with violet and lilac accents |
| **Ava Night — Afterglow** | Quiet forest surfaces with mint and soft green accents |

All editions are selectable through **Preferences → Color Theme**. The variants are standalone theme files, so their syntax and workbench palettes can be reviewed and tested independently.

## 🌌 Why Ava Night?

- Layered midnight surfaces rather than pure-black backgrounds
- Consistent color roles for functions, keywords, types, strings, numbers, and errors
- Coordinated workbench, terminal, Git, diff, selection, and focus colors
- Semantic-token colors alongside TextMate syntax scopes
- Local, dependency-light extension with automated validation

### Signature color philosophy

> Every color should communicate meaning—not compete for attention.

| Role | Ava Night palette |
| --- | --- |
| Deep background | `#0F1117` |
| Editor background | `#131722` |
| Primary text | `#D8DEE9` |
| Focus / interaction | `#61AFEF` |
| High-attention accent | `#7FDBFF` |
| Structural syntax | `#B48EFA` |
| Strings / success | `#98C379` |
| Warnings / modified | `#FFD166` |
| Errors / destructive states | `#F07178` |
| Numeric constants | `#E5C07B` |

## 📸 Screenshots

The checked-in language screenshots below show representative code examples. For current screenshots of all four editions from your installed VS Code runtime, follow [the reproducible screenshot workflow](docs/SCREENSHOTS.md).

### React + TypeScript

![React + TypeScript syntax highlighting](.github/assets/react.png)

### CSS

![CSS syntax highlighting](.github/assets/css.png)

### JSON

![JSON syntax highlighting](.github/assets/json.png)

### Constellation brand mark

The editable constellation artwork is maintained as a vector source at `assets/ava-night-constellation.svg`.

## ♿ Accessibility and quality

Ava Night checks color definitions, key contrast pairs, theme metadata, semantic token roles, language fixtures, and VSIX packaging in automated tests. The core editor, sidebar, and terminal text pairs are checked against a **4.5:1 contrast target**.

No color theme can guarantee comfort for every person, display, language server, or extension. Please report a hard-to-read state with the edition name and a screenshot. See [Accessibility & visual quality](docs/accessibility.md) for the manual review checklist and limitations.

## 🧪 Run the quality gates

Requires Node.js 22. VS Code and the VSCE packaging tool are required for package/install smoke checks and screenshot capture.

```bash
npm ci
npm test
npm run diagnostics
npm run quality
npm run qa
npm run variants:check
npx --yes @vscode/vsce package --no-dependencies
npm run vsix:smoke
npm run vscode:smoke
npm run screenshots
npm run release:check
```

- `npm test`: unit/regression tests for theme metadata, syntax assets, and contrast.
- `npm run diagnostics`: emits color, contrast, and fixture reports under `tests/results/`.
- `npm run quality`: checks required UI colors, semantic roles, palette integrity, and fixtures.
- `npm run qa`: runs the diagnostics suite and theme-family checks.
- `npm run variants:check`: validates each selectable edition and key text contrast.
- `npm run vsix:smoke`: checks required files and metadata inside the packaged extension.
- `npm run vscode:smoke`: installs the VSIX into an isolated profile and launches VS Code with a fixture.
- `npm run screenshots`: attempts reproducible real-editor screenshots for all editions; set `CODE_BIN` or `VSIX_PATH` if needed.
- `npm run release:check`: confirms the release tag matches the package version.

The generated reports are build artifacts; they are not committed automatically. Pixel-perfect screenshot regression is not claimed because OS fonts, GPU rendering, and VS Code versions can vary. See [the screenshot workflow](docs/SCREENSHOTS.md).

## 🧑‍💻 Language coverage

Repository fixtures include TypeScript/TSX, JavaScript, Python, Rust, Go, C++, CSS, HTML, JSON/JSONC, Markdown, Shell, SQL, and YAML. Syntax grammar coverage is distinct from semantic highlighting: semantic-token availability depends on the language server and its configuration.

See [Language support](docs/LANGUAGE-SUPPORT.md) for the scope and inspection instructions.

## 🚀 Install

1. Open Extensions in VS Code (`Ctrl + Shift + X`).
2. Search for **Ava Night**.
3. Install the extension.
4. Open **Preferences → Color Theme** and choose the edition you prefer.

You can also install a packaged `.vsix` using **Extensions → ⋯ → Install from VSIX...**.

## 🛠 Development

```bash
git clone https://github.com/Ava-91/ava-night.git
cd ava-night
npm ci
```

Press **F5** to launch an Extension Development Host. The local semantic-token inspector is documented in `tools/theme-inspector/README.md`.

## 🤝 Feedback

Found an issue or have an idea? [Open an issue](https://github.com/Ava-91/ava-night/issues).

## 📄 License

Released under the [MIT License](LICENSE).
