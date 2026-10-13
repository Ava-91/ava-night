# Ava Night theme family

Ava Night is a calm, midnight-inspired VS Code theme family. Each edition shares the same interaction model and semantic roles while changing the atmosphere and accent palette.

## Editions

| Edition | Character | Main accent | Best fit |
| --- | --- | --- | --- |
| **Ava Night** | Deep midnight navy | Electric blue and ice cyan | The original balanced default |
| **Moonlit** | Blue-black with cool, misty surfaces | Ice cyan | Cool, crisp workspaces |
| **Eclipse** | Midnight plum | Violet and lavender | A richer, more atmospheric palette |
| **Afterglow** | Deep forest charcoal | Mint and soft sky blue | A quieter, nature-inspired palette |

Choose an edition through **Preferences → Color Theme**. All editions are packaged in the same extension; there are no extra runtime dependencies.

## Shared design rules

- Backgrounds use layered, near-black colors rather than pure black.
- Accent colors have stable semantic roles across editions.
- Error, warning, success, and informational states remain distinct.
- Selection, hover, focus, and active-tab states use dedicated surface colors.
- Syntax and semantic-token colors are complementary; semantic highlighting depends on the language server.
- The theme does not animate or add distractions to the editor.

## Accessibility and validation

Run the automated checks from the repository root:

\`\`\`sh
npm ci
npm test
npm run diagnostics
npm run quality
npm run qa
npm run vsix:smoke
npm run release:check
\`\`\`

The test suite checks every edition's registration, JSON structure, shared base, essential UI colors, selected WCAG contrast relationships, semantic roles, and brand asset safety. These are automated guardrails, not a claim that every rendered UI combination meets every WCAG criterion.

The contrast thresholds distinguish normal text (4.5:1) from prominent UI/focus indicators (3:1). The QA report also audits the original theme's broader contrast matrix and language-fixture inventory.

Automated JSON and contrast tests cannot replace a real visual review. For release candidates, inspect the extension in VS Code using the TypeScript/React, Python, Rust, CSS, HTML, JSON, Markdown, and terminal examples. Verify selection, focus, errors, warnings, diffs, inactive tabs, and high-contrast/forced-colors settings separately.

## Visual regression workflow

1. Open a clean VS Code profile with the candidate VSIX installed.
2. Set the theme under test and open the committed syntax fixtures.
3. Capture screenshots at a fixed window size and scale.
4. Compare against approved reference screenshots; review diffs rather than blindly accepting them.
5. Update reference images only when a deliberate design change is approved.

Screenshots are intentionally reviewed as rendered artifacts; JSON-only tests must not be described as pixel-level visual regression testing.
