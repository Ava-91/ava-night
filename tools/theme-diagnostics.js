#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const themePath = path.join(root, 'themes', 'ava-night-base.json');
const fixtureDir = path.join(root, 'tests', 'syntax');
const resultsDir = path.join(root, 'tests', 'results');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map((x) => x + x).join('')
    : value.slice(0, 6);
  const n = Number.parseInt(normalized, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex) {
  return hexToRgb(hex).map((v) => v / 255).map((v) => (
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  )).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return Number(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2));
}

function collectColors(theme) {
  const colors = {};
  for (const [key, value] of Object.entries(theme.colors || {})) {
    if (typeof value === 'string' && /^#[0-9a-f]{6,8}$/i.test(value)) colors[key] = value.toUpperCase();
  }
  for (const [token, value] of Object.entries(theme.semanticTokenColors || {})) {
    const color = typeof value === 'string' ? value : value?.foreground;
    if (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)) colors[`semantic.${token}`] = color.toUpperCase();
  }
  return colors;
}

function main() {
  const theme = readJson(themePath);
  fs.mkdirSync(resultsDir, { recursive: true });

  const colors = collectColors(theme);
  const contrastPairs = [
    ['editor.foreground', 'editor.background'],
    ['editorLineNumber.foreground', 'editor.background'],
    ['breadcrumb.foreground', 'breadcrumb.background'],
    ['sideBar.foreground', 'sideBar.background'],
    ['terminal.foreground', 'terminal.background'],
    ['statusBar.foreground', 'statusBar.background'],
    ['button.foreground', 'button.background'],
    ['semantic.comment', 'editor.background'],
    ['semantic.function', 'editor.background'],
    ['semantic.class', 'editor.background'],
    ['semantic.string', 'editor.background'],
    ['semantic.number', 'editor.background'],
  ];

  const contrastReport = contrastPairs.map(([foreground, background]) => {
    const fg = colors[foreground];
    const bg = colors[background];
    const ratio = fg && bg ? contrast(fg, bg) : null;
    return {
      foreground,
      background,
      foregroundColor: fg ?? null,
      backgroundColor: bg ?? null,
      ratio,
      wcagAA: ratio !== null && ratio >= 4.5,
      wcagAALargeText: ratio !== null && ratio >= 3,
    };
  });

  const fixtures = fs.existsSync(fixtureDir)
    ? fs.readdirSync(fixtureDir).filter((name) => !name.startsWith('.')).sort().map((name) => ({
        file: name,
        extension: path.extname(name),
        bytes: fs.statSync(path.join(fixtureDir, name)).size,
      }))
    : [];

  const report = {
    generatedBy: 'tools/theme-diagnostics.js',
    theme: path.relative(root, themePath).replaceAll(path.sep, '/'),
    colors,
    semanticTokenColors: theme.semanticTokenColors || {},
    contrast: contrastReport,
    fixtures,
  };

  fs.writeFileSync(path.join(resultsDir, 'theme-colors.json'), JSON.stringify({ generatedBy: report.generatedBy, colors }, null, 2) + '\n');
  fs.writeFileSync(path.join(resultsDir, 'contrast-report.json'), JSON.stringify(contrastReport, null, 2) + '\n');
  fs.writeFileSync(path.join(resultsDir, 'fixture-inventory.json'), JSON.stringify(fixtures, null, 2) + '\n');

  const failures = contrastReport.filter((entry) => entry.ratio === null || entry.ratio < 3);
  const markdown = [
    '# Ava Night Theme Diagnostics',
    '',
    `Theme source: \`${report.theme}\``,
    '',
    `Fixtures discovered: **${fixtures.length}**`,
    '',
    '## Contrast checks',
    '',
    '| Foreground | Background | Ratio | AA |',
    '| --- | --- | ---: | :---: |',
    ...contrastReport.map((entry) => `| ${entry.foreground} | ${entry.background} | ${entry.ratio ?? 'N/A'} | ${entry.wcagAA ? 'PASS' : 'FAIL'} |`),
    '',
    `Overall: **${failures.length ? `${failures.length} checks need attention` : 'all configured checks pass'}**`,
    '',
    'Semantic-token inspection is produced by the VS Code inspector extension in `tools/theme-inspector/`.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(resultsDir, 'summary.md'), markdown);

  console.log(markdown);
  process.exitCode = failures.length ? 1 : 0;
}

main();
