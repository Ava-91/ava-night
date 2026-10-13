# Accessibility and visual quality

Ava Night treats color as a communication system, not decoration.

## Automated checks

Run `npm test`, `npm run diagnostics`, `npm run quality`, `npm run qa`, and `npm run variants:check`. The theme-family check requires at least **4.5:1 contrast** for the primary editor text, sidebar text, and terminal text. The existing diagnostics also report a wider set of UI and semantic color pairs.

WCAG contrast guidance is a useful baseline, but a theme is not automatically WCAG-conformant just because selected color pairs pass. Focus visibility, non-text UI boundaries, syntax distinguishability, font rendering, transparency, and user-specific display settings still matter.

## Manual review checklist

- [ ] Review TypeScript/TSX, Python, and Rust at normal editor font size.
- [ ] Check comments, inactive tabs, line numbers, placeholders, and inlay hints.
- [ ] Check keyboard focus, selection, find results, diagnostics, and bracket matching.
- [ ] Review terminal ANSI colors, Git decorations, diffs, and merge conflicts.
- [ ] Test with semantic highlighting both enabled and disabled.
- [ ] Do not rely on color alone to communicate errors or status.
- [ ] Review on more than one display or brightness setting when possible.

## Scope and limitations

This project supplies a VS Code color theme; it does not control every extension's custom webview or guarantee the same semantic tokens across language servers. Semantic token names and availability vary by language server. The screenshot capture helper requires a VS Code build that supports its screenshot command-line option. Generated screenshots are evidence for review, not a substitute for interactive testing.

Report an inaccessible or confusing color pairing with the theme edition, foreground/background role, and a screenshot if possible.
