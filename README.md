# 🌙 Ava Night

> **Where code meets the quiet of midnight.**

[![Version](https://img.shields.io/badge/version-1.2.0-61AFEF?style=flat-square)](https://github.com/Ava-91/ava-night/releases)
[![License](https://img.shields.io/badge/license-MIT-98C379?style=flat-square)](https://github.com/Ava-91/ava-night/blob/main/LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-theme-7FDBFF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)

Ava Night is a carefully crafted Visual Studio Code theme for developers who prefer **calm over clutter**. Its visual identity is built around a simple idea: **a monochrome moonlit mark outside, a midnight-blue workspace inside.**

The theme combines deep layered backgrounds with icy blue/cyan interaction accents and restrained violet, green, gold, and red semantic colors. The result is a recognizable midnight aesthetic that stays comfortable during long coding sessions.

---

## ✨ Highlights

- 🌙 Distinctive **A + crescent moon** brand identity
- 🌌 Deep, layered midnight interface
- 🔵 Electric blue primary interaction accent
- 🩵 Icy cyan reserved for special/high-attention details
- 🟣 Restrained violet for structural syntax
- 🧠 Semantic token support with consistent color roles
- 💻 Complete workbench styling
- 👀 Designed for extended coding sessions
- ⚡ Lightweight with zero runtime dependencies

---

## 📸 Preview

### The Ava Night visual language

The preview images intentionally use the same midnight background, cool-blue accents, and restrained syntax palette as the theme itself.

![Ava Night preview](.github/assets/hero.png)

### React + TypeScript

![React + TypeScript syntax highlighting](.github/assets/react.png)

### CSS

![CSS syntax highlighting](.github/assets/css.png)

### JSON

![JSON syntax highlighting](.github/assets/json.png)

---

## 🎨 Color Philosophy

Ava Night follows one simple principle:

> **Every color should communicate meaning—not compete for attention.**

### Core palette

| Role | Hex |
| --- | --- |
| Deep background | `#0F1117` |
| Editor background | `#131722` |
| Panel background | `#151A24` |
| Borders | `#242C3A` |
| Primary text | `#D8DEE9` |
| Focus / primary accent | `#61AFEF` |
| Special / high-attention accent | `#7FDBFF` |
| Secondary structure | `#B48EFA` |
| Success / added | `#98C379` |
| Warning / modified | `#FFD166` |
| Error / deleted | `#F07178` |

The palette deliberately separates **identity** from **semantics**: blue and cyan establish the Ava Night interface, while the other accents communicate specific syntax or state meanings.

---

## 💡 Designed For

Ava Night is designed for and currently previewed/tested against:

- TypeScript
- React / TSX
- JavaScript
- CSS
- JSON
- Markdown
- Git
- Integrated Terminal
- VS Code Workbench

The broader language fixture matrix lives under [`tests/syntax`](tests/syntax), and the machine-readable diagnostics are documented in [`tools/theme-inspector`](tools/theme-inspector) and [`tests/README.md`](tests/README.md).

---

## 🔍 Machine-readable theme diagnostics

You do **not** need to send screenshots to inspect the parts of the theme that VS Code can expose programmatically.

### Static diagnostics

Run:

```bash
npm run diagnostics
```

This writes deterministic reports to `tests/results/` covering theme colors, selected WCAG contrast pairs, semantic-token definitions, and the available syntax fixtures.

### VS Code semantic-token inspection

Open the repository in VS Code, then use **Developer: Install Extension from Location...** on `tools/theme-inspector`, or launch that folder as an Extension Development Host. Run **Ava Night: Inspect Theme** from the Command Palette.

The inspector opens every fixture in `tests/syntax` and records the semantic-token legend and token positions into `tests/results/semantic-tokens.json`.

These reports are designed to be committed or attached to an issue/PR so theme behavior can be reviewed as structured evidence instead of screenshots.

**Limit:** semantic-token and color diagnostics can expose what VS Code reports programmatically, but exact workbench/layout rendering (tabs, sidebar spacing, terminal appearance, etc.) is still visual and may require a screenshot or automated rendering test later.

---

## 🚀 Installation

### Visual Studio Marketplace

1. Open **Extensions** (`Ctrl + Shift + X`).
2. Search for **Ava Night**.
3. Click **Install**.
4. Select **Ava Night** from **Preferences → Color Theme**.

### VSIX

1. Download the latest release.
2. Open **Extensions**.
3. Click **⋯ → Install from VSIX...**.
4. Select the downloaded `.vsix` file.

---

## 🛠 Development

```bash
git clone https://github.com/Ava-91/ava-night.git
cd ava-night
npm install
```

Press **F5** inside Visual Studio Code to launch an Extension Development Host and preview changes instantly.

---

## 📈 Roadmap

- Additional language-specific optimizations
- Expanded semantic highlighting
- Accessibility improvements
- More polished terminal colors
- Future Ava Night variants

---

## 🤝 Feedback

Found a bug or have an idea? [Open an issue](https://github.com/Ava-91/ava-night/issues) or submit a feature request.

If Ava Night improves your coding experience, consider leaving a ⭐ on the repository—it helps others discover the theme.

---

## 📄 License

Released under the **MIT License**.
