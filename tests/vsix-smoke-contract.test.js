const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('VSIX smoke workflow is CI-only', () => {
  const root = path.resolve(__dirname, '..');
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'package-smoke.yml'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'tools', 'vsix-smoke.js'), 'utf8');
  assert.match(workflow, /pull_request/);
  assert.match(workflow, /vsce package --no-dependencies/);
  assert.match(workflow, /vsix:smoke/);
  assert.match(workflow, /upload-artifact@v4/);
  assert.doesNotMatch(workflow, /vsce publish/);
  assert.match(script, /extension\/package\.json/);
  assert.match(script, /themes\/ava-night\.json/);
});
