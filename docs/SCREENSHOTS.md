# Screenshot and visual regression workflow

Ava Night uses both machine-checkable theme validation and screenshots of the real VS Code editor. JSON/contrast tests cannot prove that every workbench surface looks correct.

## Capture screenshots

1. Install Node.js 22 and VS Code.
2. Run `npm ci`.
3. Package the extension: `npx --yes @vscode/vsce package --no-dependencies`.
4. Run `npm run screenshots`.
5. Review the four PNGs and `manifest.json` under `tests/results/screenshots/`.

Set `CODE_BIN` to your VS Code executable and `VSIX_PATH` to a specific packaged VSIX if needed. Screenshots are generated artifacts and are not committed by default.

## Review protocol

Use the same VS Code version, fixture, display scale, and window size for comparable screenshots. Inspect the editor, sidebar, tabs, terminal, selection, focus border, diagnostics, and semantic highlighting. When changing a palette, compare the new screenshot to the last accepted baseline and document intentional differences.

This repository does not currently claim pixel-perfect cross-platform screenshot regression: font rasterization, OS chrome, and GPU rendering can differ. CI validates theme data, tests, package contents, and installation/launch smoke behavior. A screenshot run should be treated as visual evidence that still needs review.
