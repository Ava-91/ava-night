#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const baseThemePath = path.join(root, 'themes', 'ava-night-base.json');
const publishedThemePath = path.join(root, 'themes', 'ava-night.json');
const fixtureDir = path.join(root, 'tests', 'syntax');

const REQUIRED_UI_COLORS = [
  'editor.background', 'editor.foreground', 'sideBar.background', 'sideBar.foreground',
  'panel.background', 'statusBar.background', 'statusBar.foreground',
  'editorLineNumber.foreground', 'editorLineNumber.activeForeground',
  'button.background', 'button.foreground', 'focusBorder', 'editor.selectionBackground',
  'editorCursor.foreground', 'terminal.background', 'terminal.foreground',
  'errorForeground', 'editorWarning.foreground', 'editorInfo.foreground',
];

const REQUIRED_SEMANTIC_COLORS = [
  'comment', 'function', 'method', 'keyword', 'class', 'interface', 'type',
  'string', 'number', 'regexp', 'decorator', 'variable', 'property', 'parameter',
  'operator',
];

const CONTRAST_PAIRS = [
  ['editor.foreground', 'editor.background'],
  ['editorLineNumber.foreground', 'editor.background'],
  ['editorLineNumber.activeForeground', 'editor.background'],
  ['breadcrumb.foreground', 'breadcrumb.background'],
  ['sideBar.foreground', 'sideBar.background'],
  ['panelTitle.activeForeground', 'panel.background'],
  ['terminal.foreground', 'terminal.background'],
  ['statusBar.foreground', 'statusBar.background'],
  ['button.foreground', 'button.background'],
  ['input.foreground', 'input.background'],
  ['input.placeholderForeground', 'input.background'],
  ['semantic.comment', 'editor.background'],
  ['semantic.function', 'editor.background'],
  ['semantic.class', 'editor.background'],
  ['semantic.string', 'editor.background'],
  ['semantic.number', 'editor.background'],
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function isHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value);
}

function hexToRgb(hex) {
  const value = hex.slice(1, 7);
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function luminance(hex) {
  return hexToRgb(hex).map((v) => v / 255).map((v) => (
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  )).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function collectColorValues(theme) {
  const values = [];
  for (const [key, value] of Object.entries(theme.colors || {})) {
    if (typeof value === 'string') values.push([`ui.${key}`, value]);
  }
  for (const [key, value] of Object.entries(theme.semanticTokenColors || {})) {
    const color = typeof value === 'string' ? value : value?.foreground;
    if (color) values.push([`semantic.${key}`, color]);
  }
  return values;
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function main() {
  const base = readJson(baseThemePath);
  const published = readJson(publishedThemePath);

  if (published.name !== 'Ava Night') fail('published theme name must be Ava Night');
  if (typeof published.include !== 'string') fail('published theme must include a base theme');
  const includedPath = path.resolve(path.dirname(publishedThemePath), published.include);
  if (!fs.existsSync(includedPath)) fail(`included base theme does not exist: ${published.include}`);

  const colors = base.colors || {};
  for (const key of REQUIRED_UI_COLORS) {
    if (!isHexColor(colors[key])) fail(`missing or invalid UI color: ${key}`);
  }

  for (const [key, value] of collectColorValues(base)) {
    if (!isHexColor(value)) fail(`invalid color value: ${key} = ${value}`);
  }

  const semantic = base.semanticTokenColors || {};
  for (const key of REQUIRED_SEMANTIC_COLORS) {
    const value = semantic[key];
    const color = typeof value === 'string' ? value : value?.foreground;
    if (!isHexColor(color)) fail(`missing or invalid semantic token: ${key}`);
  }

  for (const [foreground, background] of CONTRAST_PAIRS) {
    const fg = foreground.startsWith('semantic.')
      ? semantic[foreground.slice(9)]
      : colors[foreground];
    const bg = colors[background];
    const fgColor = typeof fg === 'string' ? fg : fg?.foreground;
    if (!isHexColor(fgColor) || !isHexColor(bg)) {
      fail(`contrast pair has missing/invalid colors: ${foreground} / ${background}`);
      continue;
    }
    const ratio = contrast(fgColor, bg);
    if (ratio < 3) fail(`contrast below 3:1: ${foreground} / ${background} = ${ratio.toFixed(2)}:1`);
  }

  if (!fs.existsSync(fixtureDir)) fail('syntax fixture directory is missing');
  const fixtures = fs.readdirSync(fixtureDir).filter((name) => !name.startsWith('.'));
  if (fixtures.length < 15) fail(`expected at least 15 syntax fixtures, found ${fixtures.length}`);

  if (process.exitCode) process.exitCode = 1;
  else console.log(`Theme quality checks passed: ${fixtures.length} fixtures, required UI colors, semantic tokens, and contrast pairs validated.`);
}

main();
