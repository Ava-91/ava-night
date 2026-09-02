const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('release gate requires an explicit versioned event and never publishes', () => {
  const root = path.resolve(__dirname, '..');
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'release-gate.yml'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'tools', 'release-check.js'), 'utf8');
  assert.match(workflow, /tags:\s*\n\s+- ['"]v\*\.\*\.\*['"]/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /release:check/);
  assert.match(workflow, /vsix:smoke/);
  assert.match(workflow, /vscode:smoke/);
  assert.doesNotMatch(workflow, /vsce publish/);
  assert.match(script, /Release tag\/version mismatch/);
  assert.match(script, /pkg\.version/);
});
