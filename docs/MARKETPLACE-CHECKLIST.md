# Marketplace and release checklist

Use this checklist when preparing a new Ava Night release or making a significant listing change.

## Marketplace listing

- [ ] Extension display name, publisher, version, description, license, icon, and repository links are correct in `package.json`.
- [ ] All four theme labels match the names inside their theme JSON files.
- [ ] The opening description explains the theme's benefit without making unsupported claims.
- [ ] Screenshots show the actual theme running in VS Code and correspond to the current theme files.
- [ ] Screenshot alt text identifies the edition and what is shown.
- [ ] Installation instructions and the direct Marketplace link work.
- [ ] Keywords describe real user search terms without keyword stuffing.
- [ ] Accessibility wording describes the checks performed and does not claim full WCAG conformance.

## Before packaging

- [ ] Update `CHANGELOG.md` with user-visible changes.
- [ ] Set the intended version consistently in package metadata and lockfile when applicable.
- [ ] Run `npm ci`, `npm test`, `npm run diagnostics`, `npm run quality`, `npm run variants:check`, and `npm run qa`.
- [ ] Package the VSIX and run `npm run vsix:smoke`.
- [ ] Run `npm run vscode:smoke` where the VS Code CLI and required system dependencies are available.
- [ ] Install the packaged VSIX in a clean VS Code profile and select each of the four editions.
- [ ] Check the README's screenshot links and inspect the generated screenshots for unintended changes.
- [ ] Review the Git diff to ensure no credentials, local configuration, temporary files, or unintended visual baselines are included.

## Publish and verify

- [ ] Confirm the release version and Git tag agree.
- [ ] Confirm the release commit is the one that passed CI.
- [ ] Publish through the configured Marketplace publisher workflow or VSCE credentials; never put tokens in source files or logs.
- [ ] Open the public Marketplace listing after publication and verify the version, description, icon, screenshots, and theme picker entries.
- [ ] Keep a short release note with the most important user-visible changes.

Passing automated checks does not replace interactive visual review. Theme colors can render differently across displays, fonts, operating systems, and VS Code versions.
