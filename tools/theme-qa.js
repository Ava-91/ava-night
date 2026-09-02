#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const resultsDir = path.join(root, 'tests', 'results');
const contrastPath = path.join(resultsDir, 'contrast-report.json');
const inventoryPath = path.join(resultsDir, 'fixture-inventory.json');
const qaJsonPath = path.join(resultsDir, 'qa-report.json');
const qaMarkdownPath = path.join(resultsDir, 'qa-report.md');

const expectedFixtures = new Set([
  'cpp.cpp', 'css.css', 'go.go', 'html.html', 'javascript.js', 'json.json',
  'jsonc.jsonc', 'markdown.md', 'python.py', 'react.tsx', 'rust.rs', 'shell.sh',
  'sql.sql', 'typescript.ts', 'yaml.yaml',
]);

const requiredPairs = [
  ['editor.foreground', 'editor.background'],
  ['sideBar.foreground', 'sideBar.background'],
  ['terminal.foreground', 'terminal.background'],
  ['panelTitle.activeForeground', 'panel.background'],
  ['input.foreground', 'input.background'],
  ['button.foreground', 'button.background'],
  ['textLink.foreground', 'editor.background'],
  ['editorError.foreground', 'editor.background'],
  ['editorWarning.foreground', 'editor.background'],
  ['editorInfo.foreground', 'editor.background'],
  ['semantic.function', 'editor.background'],
  ['semantic.class', 'editor.background'],
  ['semantic.string', 'editor.background'],
  ['semantic.number', 'editor.background'],
];

function run(script) {
  return spawnSync(process.execPath, [path.join(root, 'tools', script)], {
    cwd: root,
    encoding: 'utf8',
  });
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function main() {
  fs.mkdirSync(resultsDir, { recursive: true });

  const diagnostics = run('theme-diagnostics.js');
  const quality = run('theme-quality.js');
  if (diagnostics.status !== 0) fail('theme diagnostics failed');
  if (quality.status !== 0) fail('theme quality checks failed');

  const contrast = JSON.parse(fs.readFileSync(contrastPath, 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  const pairSet = new Set(contrast.map((entry) => `${entry.foreground} / ${entry.background}`));
  const missingPairs = requiredPairs
    .filter(([fg, bg]) => !pairSet.has(`${fg} / ${bg}`))
    .map(([fg, bg]) => `${fg} / ${bg}`);
  if (missingPairs.length) fail(`missing required contrast pairs: ${missingPairs.join(', ')}`);

  const missingColors = contrast.filter((entry) => entry.ratio === null);
  if (missingColors.length) fail(`missing colors in contrast matrix: ${missingColors.map((entry) => entry.foreground).join(', ')}`);

  const thresholdFailures = contrast.filter((entry) => entry.ratio < entry.minimumRatio);
  if (thresholdFailures.length) fail(`contrast thresholds failed: ${thresholdFailures.map((entry) => `${entry.foreground} (${entry.ratio}:1 < ${entry.minimumRatio}:1)`).join(', ')}`);

  const fixtureNames = inventory.map((entry) => entry.file);
  const missingFixtures = [...expectedFixtures].filter((file) => !fixtureNames.includes(file));
  const unexpectedFixtures = fixtureNames.filter((file) => !expectedFixtures.has(file));
  if (missingFixtures.length || unexpectedFixtures.length) {
    fail(`fixture inventory mismatch (missing: ${missingFixtures.join(', ') || 'none'}; unexpected: ${unexpectedFixtures.join(', ') || 'none'})`);
  }

  const categories = [...new Set(contrast.map((entry) => entry.category))].sort();
  const states = {
    normal: pairSet.has('editor.foreground / editor.background'),
    inactive: pairSet.has('tab.inactiveForeground / tab.inactiveBackground'),
    active: pairSet.has('tab.activeForeground / tab.activeBackground'),
    selection: pairSet.has('menu.selectionForeground / menu.selectionBackground'),
    diagnostics: pairSet.has('editorError.foreground / editor.background') && pairSet.has('editorWarning.foreground / editor.background') && pairSet.has('editorInfo.foreground / editor.background'),
    terminal: pairSet.has('terminal.foreground / terminal.background') && pairSet.has('terminal.ansiCyan / terminal.background'),
    semantic: ['semantic.function', 'semantic.class', 'semantic.string', 'semantic.number'].every((name) => pairSet.has(`${name} / editor.background`)),
  };

  const report = {
    generatedBy: 'tools/theme-qa.js',
    status: process.exitCode ? 'fail' : 'pass',
    checks: {
      diagnostics: diagnostics.status === 0,
      quality: quality.status === 0,
      requiredContrastPairs: missingPairs.length === 0,
      contrastThresholds: thresholdFailures.length === 0,
      missingColors: missingColors.length === 0,
      fixtureInventory: missingFixtures.length === 0 && unexpectedFixtures.length === 0,
    },
    contrast: {
      total: contrast.length,
      passing: contrast.filter((entry) => entry.ratio >= entry.minimumRatio).length,
      categories,
    },
    states,
    fixtures: {
      expected: expectedFixtures.size,
      discovered: inventory.length,
      languages: fixtureNames,
    },
    limitations: [
      'This report validates theme data and contrast relationships; it does not render VS Code pixels.',
      'Final visual validation should be performed in VS Code using the listed language fixtures.',
    ],
  };

  fs.writeFileSync(qaJsonPath, JSON.stringify(report, null, 2) + '\n');

  const status = (value) => value ? 'PASS' : 'FAIL';
  const markdown = [
    '# Ava Night Visual QA',
    '',
    `Overall: **${report.status.toUpperCase()}**`,
    '',
    '## Checks',
    '',
    '| Check | Status |',
    '| --- | :---: |',
    `| Theme diagnostics | ${status(report.checks.diagnostics)} |`,
    `| Theme quality | ${status(report.checks.quality)} |`,
    `| Required contrast pairs | ${status(report.checks.requiredContrastPairs)} |`,
    `| Contrast thresholds | ${status(report.checks.contrastThresholds)} |`,
    `| Missing colors | ${status(report.checks.missingColors)} |`,
    `| Fixture inventory | ${status(report.checks.fixtureInventory)} |`,
    '',
    '## Coverage',
    '',
    `- Contrast checks: **${report.contrast.passing}/${report.contrast.total}** passing`,
    `- Contrast categories: **${categories.join(', ')}**`,
    `- Language fixtures: **${report.fixtures.discovered}/${report.fixtures.expected}**`,
    '',
    '## State coverage',
    '',
    ...Object.entries(states).map(([name, value]) => `- ${name}: **${status(value)}**`),
    '',
    '## Important limitation',
    '',
    ...report.limitations.map((item) => `- ${item}`),
    '',
    'Run `npm run qa` to regenerate this report.',
    '',
  ].join('\n');
  fs.writeFileSync(qaMarkdownPath, markdown);

  console.log(markdown);
}

main();
