# Accessibility and visual quality

Ava Night treats color as a communication system, not decoration. Automated checks are a safety net; interactive review remains necessary.

## Automated checks

Run:

```bash
npm test
npm run diagnostics
npm run quality
npm run variants:check
npm run qa
```

The theme-family check requires at least **4.5:1 contrast** for primary editor text, sidebar text, and terminal text in each resolved edition. It also checks line numbers, input text and placeholders, active/inactive tabs, panel titles, diagnostic colors, six terminal ANSI colors, focus borders, and Git added/deleted gutter markers. Text pairs use a 4.5:1 target; focus and non-text state markers use a 3:1 target. Other diagnostics inspect additional UI and semantic color pairs.

Passing selected contrast checks does not establish full WCAG conformance. Focus visibility, non-text UI boundaries, syntax distinguishability, font rendering, transparency, display settings, and extension-specific UI still matter.

## Manual review matrix

Review all four editions at your normal editor font size and at a smaller size. Test with semantic highlighting both enabled and disabled.

- [ ] **Code:** TypeScript/TSX, Python, and Rust; inspect keywords, types, functions, properties, parameters, comments, strings, numbers, and decorators.
- [ ] **Workbench:** active and inactive tabs, breadcrumbs, sidebar labels, line numbers, placeholders, inlay hints, minimap, and status bar.
- [ ] **Interaction:** keyboard focus, text selection, find results, hover/peek views, bracket matching, and command-palette selection.
- [ ] **Diagnostics:** errors, warnings, informational hints, inline squiggles, and problem panel text.
- [ ] **Source control:** added/removed lines, changed files, staged changes, merge conflicts, and Git decorations.
- [ ] **Terminal:** ANSI colors for normal and bright variants, prompts, errors, and selected text.
- [ ] **Usability:** check the palette at different brightness levels and on another display if available. Confirm that color is not the only way status is communicated.

Record issues with the edition, VS Code version, relevant language or UI surface, foreground/background pair when known, and a screenshot if possible.

## Regression discipline

When changing a shared palette token, review every edition that inherits it. When changing an edition override, review that edition in isolation and compare it with the other three to ensure the family remains coherent.

Use `npm run screenshots` for reproducible review images where supported. Screenshot diffs are useful signals, not definitive pass/fail judgments: operating systems, fonts, rendering, and VS Code versions can affect pixels.

## Scope and limitations

Ava Night is a VS Code color theme. It cannot control every extension's custom webview, guarantee identical semantic tokens across language servers, or ensure every user's display renders colors identically. Semantic token names and availability vary by language server and configuration.

Report a difficult or confusing color pairing with the theme edition, foreground/background role, and a screenshot if possible.
