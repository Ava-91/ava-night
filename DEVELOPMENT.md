# Ava Night development guide

This guide describes the current four-edition theme family and its validation workflow.

## Requirements

- Node.js 22 and npm
- Git
- Visual Studio Code for Extension Development Host testing
- The VS Code CLI and VSCE for packaging, installed-extension smoke tests, and screenshot capture

## Set up the project

```bash
git clone https://github.com/Ava-91/ava-night.git
cd ava-night
npm ci
```

Press **F5** in VS Code to open an Extension Development Host with the local extension.

## Project layout

- `package.json` — extension metadata and the four selectable theme contributions.
- `themes/ava-night.json` — Ava Night's published theme entry point.
- `themes/ava-night-moonlit.json` — Moonlit edition.
- `themes/ava-night-eclipse.json` — Eclipse edition.
- `themes/ava-night-afterglow.json` — Afterglow edition.
- `themes/ava-night-base.json` and `themes/palette.json` — shared theme foundation and palette.
- `tests/syntax/` — representative language fixtures.
- `tools/` — diagnostics, quality checks, variant checks, packaging smoke tests, screenshot capture, and release validation.
- `docs/` — accessibility, language support, and screenshot review guidance.

Theme entry points can include shared files and override selected colors. Validate the resolved theme rather than reviewing an individual JSON file in isolation.

## Validate a change

Run these checks before opening a pull request:

```bash
npm test
npm run diagnostics
npm run quality
npm run variants:check
npm run qa
```

For packaging and installed-extension checks, use the VS Code CLI and VSCE:

```bash
npx --yes @vscode/vsce package --no-dependencies
npm run vsix:smoke
npm run vscode:smoke
```

For screenshot capture, follow [the screenshot guide](docs/SCREENSHOTS.md). Depending on your environment, you may need to set `CODE_BIN` or `VSIX_PATH`. Screenshot output can differ across operating systems, fonts, GPUs, and VS Code versions, so use it as visual evidence rather than assuming pixel-identical output.

To run the release-version consistency check, provide the version you intend to validate:

```bash
RELEASE_VERSION=1.4.0 npm run release:check
```

Replace `1.4.0` with the version being checked. This check does not publish the extension.

## Contribution checklist

- [ ] Test the affected edition in a real Extension Development Host.
- [ ] Run the automated checks relevant to the change.
- [ ] Review contrast, focus visibility, and syntax distinguishability.
- [ ] Update documentation or the changelog when user-visible behavior changes.
- [ ] Confirm the generated screenshots still represent the intended appearance.
- [ ] Verify the packaged VSIX before preparing a release.

Keep changes focused: fix a demonstrated readability or compatibility issue before adding another theme edition.

## Useful links

- [Install Ava Night from the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Ava-91.ava-night)
- [Report an issue or suggest an improvement](https://github.com/Ava-91/ava-night/issues)
- [Browse the repository](https://github.com/Ava-91/ava-night)
