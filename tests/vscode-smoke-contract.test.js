const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('VS Code smoke harness keeps release boundaries explicit', () => {
  const source = fs.readFileSync(path.join(root, 'tools', 'vscode-smoke.js'), 'utf8');
  assert.match(source, /workbench\.colorTheme/);
  assert.match(source, /Ava Night/);
  assert.match(source, /xvfb-run/);
  assert.match(source, /vscode-smoke-report\.json/);
});
