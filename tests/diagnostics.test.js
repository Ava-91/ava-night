const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const fixtureDir = path.join(__dirname, 'syntax');
const resultsDir = path.join(__dirname, 'results');
const diagnosticScript = path.join(root, 'tools', 'theme-diagnostics.js');
const qualityScript = path.join(root, 'tools', 'theme-quality.js');
const baseTheme = path.join(root, 'themes', 'ava-night-base.json');

const expectedFixtures = [
  'cpp.cpp', 'css.css', 'go.go', 'html.html', 'javascript.js', 'json.json',
  'jsonc.jsonc', 'markdown.md', 'python.py', 'react.tsx', 'rust.rs', 'shell.sh',
  'sql.sql', 'typescript.ts', 'yaml.yaml',
];

function run(script) {
  return spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
}

test('all language fixtures exist', () => {
  const actual = fs.readdirSync(fixtureDir).filter((file) => !file.startsWith('.')).sort();
  assert.deepEqual(actual, expectedFixtures);
});

test('theme diagnostics runs successfully', () => {
  const result = run(diagnosticScript);
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stdout + result.stderr);

  for (const file of ['theme-colors.json', 'contrast-report.json', 'fixture-inventory.json', 'summary.md']) {
    assert.equal(fs.existsSync(path.join(resultsDir, file)), true, `${file} was not generated`);
  }
});

test('diagnostics reports all configured contrast checks', () => {
  const report = JSON.parse(fs.readFileSync(path.join(resultsDir, 'contrast-report.json'), 'utf8'));
  assert.ok(report.length >= 12);
  for (const entry of report) {
    assert.equal(typeof entry.foreground, 'string');
    assert.equal(typeof entry.background, 'string');
    assert.equal(typeof entry.ratio, 'number');
    assert.ok(entry.ratio >= 3, `${entry.foreground} / ${entry.background} is ${entry.ratio}:1`);
  }
});

test('diagnostics inventory matches fixtures', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(resultsDir, 'fixture-inventory.json'), 'utf8'));
  assert.deepEqual(inventory.map((entry) => entry.file), expectedFixtures);
  assert.ok(inventory.every((entry) => entry.bytes > 0));
});

test('theme quality checks pass', () => {
  const result = run(qualityScript);
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('theme JSON parses and exposes semantic tokens', () => {
  const theme = JSON.parse(fs.readFileSync(baseTheme, 'utf8'));
  assert.equal(theme.name, 'Ava Night');
  assert.ok(Object.keys(theme.colors).length >= 100);
  assert.ok(Object.keys(theme.semanticTokenColors).length >= 15);
});
