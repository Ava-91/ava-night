# QA and rendering workflow

Ava Night separates ordinary CI validation from release actions.

## Static QA

Run the deterministic checks locally:

```bash
npm run diagnostics
npm run quality
npm run qa
npm test
```

## VS Code rendering smoke test

CI packages a disposable VSIX, installs a pinned VS Code 1.100.0 runtime, installs the VSIX into an isolated extension directory, selects `Ava Night`, and launches VS Code under Xvfb with a representative JavaScript fixture.

The smoke harness writes `tests/results/vscode-smoke-report.json`. It is a validation artifact only: it does **not** publish to the Marketplace, create a GitHub Release, or bump the extension version.

## Release boundary

A commit or pull request may run package and rendering validation, but it is never a release by itself. Publishing is handled only by the explicit release workflow described in `.github/workflows/release.yml`.
