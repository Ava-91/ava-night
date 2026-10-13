# Screenshot and visual regression workflow

Ava Night uses both machine-checkable theme validation and screenshots of the real VS Code editor. JSON and contrast tests cannot prove that every workbench surface looks correct.

## Capture screenshots

1. Install Node.js 22 and VS Code.
2. Run `npm ci`.
3. Package the extension: `npx --yes @vscode/vsce package --no-dependencies`.
4. Run `npm run screenshots`.
5. Review the four PNGs and `manifest.json` under `tests/results/screenshots/`.

Set `CODE_BIN` to your VS Code executable and `VSIX_PATH` to a specific packaged VSIX if needed. Screenshots are generated artifacts and are not committed by default.

## Review protocol

Use the same VS Code version, fixture, display scale, and window size for comparable screenshots. Inspect the editor, sidebar, tabs, terminal, selection, focus border, diagnostics, and semantic highlighting. When changing a palette, compare the new screenshot to the last accepted baseline and document intentional differences.

## Pixel snapshot regression

After reviewing the four screenshots, approve them as local baselines with:

```bash
UPDATE_SCREENSHOT_BASELINES=1 npm run visual:regression
```

Commit the resulting `tests/visual-baselines/*.png` files when you intentionally want to update the visual reference. Later runs compare decoded PNG pixels with a configurable `VISUAL_DIFF_LIMIT_PERCENT` (default `0.5` percent) and fail when a baseline is missing, dimensions change, or too many pixels differ. Baseline updates should be reviewed—not accepted automatically. The comparison currently targets RGB channels and expects non-interlaced 8-bit RGB/RGBA PNGs.

Pixel output can still differ across OS fonts, display scaling, GPU rendering, and VS Code versions. Capture and compare on the same environment for meaningful results. CI validates theme data, tests, package contents, and installation/launch smoke behavior; it skips pixel comparisons until reviewed baselines are present.
