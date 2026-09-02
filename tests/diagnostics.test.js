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
const qaScript = path.join(root, 'tools', 'theme-qa.js');
const baseTheme = path.join(root, 'themes', 'ava-night-base.json');
const palettePath = path.join(root, 'themes', 'palette.json');

const expectedFixtures = [
  'cpp.cpp', 'css.css', 'go.go', 'html.html', 'javascript.js', 'json.json',
  'jsonc.jsonc', 'markdown.md', 'python.py', 'react.tsx', 'rust.rs', 'shell.sh',
  'sql.sql', 'typescript.ts', 'yaml.yaml',
];

const semanticExpectations = {
  function: 'blue', method: 'blue', macro: 'blue', builtin: 'blue',
  keyword: 'purple', 'keyword.control': 'purple', namespace: 'purple', module: 'purple',
  typeOperator: 'purple', modifier: 'purple',
  class: 'yellow', enum: 'yellow', enumMember: 'yellow', interface: 'yellow',
  type: 'yellow', typeParameter: 'yellow', number: 'number',
  string: 'green', regexp: 'cyan', decorator: 'cyan', annotation: 'cyan',
  label: 'cyan', event: 'cyan',
  variable: 'text', 'variable.readonly': 'text', 'variable.defaultLibrary': 'text',
  'variable.member': 'text', 'variable.mutable': 'text', property: 'text',
  'property.readonly': 'text', parameter: 'text', operator: 'text', comment: 'mutedText',
};

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

test('diagnostics covers the full configured contrast matrix', () => {
  const report = JSON.parse(fs.readFileSync(path.join(resultsDir, 'contrast-report.json'), 'utf8'));
  assert.equal(report.length, 40);
  assert.ok(report.every((entry) => typeof entry.ratio === 'number'));
  assert.ok(report.every((entry) => entry.ratio >= entry.minimumRatio));
  const decorativeGuide = report.find((entry) => entry.foreground === 'editorIndentGuide.background1');
  assert.equal(decorativeGuide.category, 'decorative');
  assert.equal(decorativeGuide.minimumRatio, 1.1);
  const listCheck = report.find((entry) => entry.foreground === 'list.foreground');
  assert.equal(listCheck.backgroundColor, '#151A24');
  assert.ok(listCheck.ratio >= 3);
  const requiredPairs = [
    'input.placeholderForeground / input.background',
    'menu.selectionForeground / menu.selectionBackground',
    'gitDecoration.addedResourceForeground / sideBar.background',
    'gitDecoration.modifiedResourceForeground / sideBar.background',
    'terminal.ansiCyan / terminal.background',
    'semantic.comment / editor.background',
  ];
  const actualPairs = new Set(report.map((entry) => `${entry.foreground} / ${entry.background}`));
  for (const pair of requiredPairs) assert.equal(actualPairs.has(pair), true, `missing contrast pair: ${pair}`);
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

test('accessibility and visual QA report passes with complete coverage', () => {
  const result = run(qaScript);
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const report = JSON.parse(fs.readFileSync(path.join(resultsDir, 'qa-report.json'), 'utf8'));
  assert.equal(report.status, 'pass');
  assert.deepEqual(report.checks, {
    diagnostics: true,
    quality: true,
    requiredContrastPairs: true,
    contrastThresholds: true,
    missingColors: true,
    fixtureInventory: true,
  });
  assert.equal(report.contrast.total, 40);
  assert.equal(report.contrast.passing, 40);
  assert.deepEqual(report.fixtures.languages, expectedFixtures);
  assert.ok(Object.values(report.states).every(Boolean));
  assert.equal(fs.existsSync(path.join(resultsDir, 'qa-report.md')), true);
});

test('semantic roles remain mapped to the canonical palette', () => {
  const theme = JSON.parse(fs.readFileSync(baseTheme, 'utf8'));
  const palette = JSON.parse(fs.readFileSync(palettePath, 'utf8'));
  for (const [token, paletteName] of Object.entries(semanticExpectations)) {
    const value = theme.semanticTokenColors[token];
    const color = typeof value === 'string' ? value : value?.foreground;
    assert.equal(color.toUpperCase(), palette[paletteName].toUpperCase(), `${token} drifted from palette.${paletteName}`);
  }
});

test('theme JSON exposes the complete semantic role set', () => {
  const theme = JSON.parse(fs.readFileSync(baseTheme, 'utf8'));
  for (const token of Object.keys(semanticExpectations)) assert.equal(token in theme.semanticTokenColors, true, `missing semantic token: ${token}`);
});

test('Markdown fixture and Git diff/merge roles are explicitly covered', () => {
  const markdown = fs.readFileSync(path.join(fixtureDir, 'markdown.md'), 'utf8');
  for (const construct of ['# Ava Night', '**midnight**', '*restrained*', '~~noise~~', '[Repository]', '`inline code`', '```ts', '> Code', '- [x]', '| Role | Color |', '<span']) {
    assert.ok(markdown.includes(construct), `Markdown fixture is missing ${construct}`);
  }

  const theme = JSON.parse(fs.readFileSync(baseTheme, 'utf8'));
  const requiredColors = [
    'diffEditor.insertedTextBackground', 'diffEditor.removedTextBackground',
    'diffEditor.insertedTextBorder', 'diffEditor.removedTextBorder',
    'diffEditor.unchangedRegionBackground', 'diffEditor.unchangedRegionForeground',
    'merge.currentHeaderBackground', 'merge.currentContentBackground',
    'merge.incomingHeaderBackground', 'merge.incomingContentBackground',
    'merge.commonContentBackground', 'merge.commonHeaderBackground',
    'editorOverviewRuler.addedForeground', 'editorOverviewRuler.modifiedForeground',
    'editorOverviewRuler.deletedForeground',
  ];
  for (const key of requiredColors) assert.equal(key in theme.colors, true, `missing Git/diff/merge color: ${key}`);

  const markdownScopes = theme.tokenColors.flatMap((entry) => entry.scope || []);
  for (const scope of ['markup.heading', 'markup.bold', 'markup.italic', 'markup.strikethrough', 'markup.underline.link', 'markup.inline.raw', 'markup.quote', 'markup.list']) {
    assert.ok(markdownScopes.includes(scope), `missing Markdown scope: ${scope}`);
  }
});
