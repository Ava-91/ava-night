# Releases

Ava Night deliberately separates CI from releasing.

## Ordinary commits and pull requests

Pushes and pull requests may run diagnostics, accessibility QA, tests, VSIX packaging, VSIX inspection, and VS Code smoke tests. These are validation activities only. They do not publish to the Marketplace, create a GitHub Release, or bump the version.

## Explicit release gate

A release validation run starts only from either:

- a version tag such as `v1.2.0`, or
- a manually dispatched workflow with an explicit version input.

The release gate requires that the requested version exactly matches `package.json`, then runs the full QA/test/package/rendering chain and uploads the resulting VSIX and reports.

The gate intentionally stops short of Marketplace publishing. Publishing remains a separate, deliberate release action using the validated artifact.
