const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const fixtureDir = path.join(__dirname, 'syntax');
const diagnosticScript = path.join(root, 'tools', 'theme-diagnostics.js');

const expectedFixtures = [
  'cpp.cpp', 'css.css', 'go.go', 'html.html', 'javascript.js', 'json.json',
  'jsonc.jsonc', 'markdown.md', 'python.py', 'react.tsx', 'rust.rs', 'shell.sh',
  'sql.sql', 'typescript.ts', 'yaml.yaml',
];

test('all language fixtures exist', () => {
  const actual = fs.readdirSync(fixtureDir).filter((file) => !file.startsWith('.')).sort();
  assert.deepEqual(actual, expectedFixtures);
});

test('theme diagnostics runs successfully', () => {
  const result = spawnSync(process.execPath, [diagnosticScript], {
    cwd: root,
    encoding: 'utf8',
  });

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stdout + result.stderr);

  for (const file of ['theme-colors.json', 'contrast-report.json', 'fixture-inventory.json', 'summary.md']) {
    assert.equal(fs.existsSync(path.join(__dirname, 'results', file)), true, `${file} was not generated`);
  }
});
