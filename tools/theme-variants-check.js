#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lum = (hex) => rgb(hex).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const fail = (message) => { console.error('FAIL:', message); process.exitCode = 1; };
const names = new Set();
for (const entry of pkg.contributes?.themes ?? []) {
  if (!entry.label || names.has(entry.label)) fail('theme labels must be unique and non-empty');
  names.add(entry.label);
  const file = path.resolve(root, entry.path);
  if (!fs.existsSync(file)) { fail(`missing theme file: ${entry.path}`); continue; }
  let theme;
  try { theme = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { fail(`invalid JSON theme: ${entry.path}`); continue; }
  if (theme.name !== entry.label) fail(`theme name mismatch: ${entry.path} says ${theme.name}, package says ${entry.label}`);
  if (theme.include) {
    const included = path.resolve(path.dirname(file), theme.include);
    if (!fs.existsSync(included)) { fail(`${entry.label}: included theme missing: ${theme.include}`); continue; }
    try {
      const base = JSON.parse(fs.readFileSync(included, 'utf8'));
      theme = { ...base, ...theme, colors: { ...(base.colors ?? {}), ...(theme.colors ?? {}) }, semanticTokenColors: { ...(base.semanticTokenColors ?? {}), ...(theme.semanticTokenColors ?? {}) }, tokenColors: theme.tokenColors ?? base.tokenColors };
    } catch { fail(`${entry.label}: invalid included theme JSON`); continue; }
  }
  const colors = theme.colors ?? {};
  for (const key of ['editor.background','editor.foreground','sideBar.background','sideBar.foreground','terminal.background','terminal.foreground','focusBorder']) {
    if (!/^#[0-9a-f]{6}$/i.test(colors[key] ?? '')) fail(`${entry.label}: missing/invalid ${key}`);
  }
  for (const [fg,bg] of [['editor.foreground','editor.background'],['sideBar.foreground','sideBar.background'],['terminal.foreground','terminal.background']]) {
    if (colors[fg] && colors[bg] && ratio(colors[fg],colors[bg]) < 4.5) fail(`${entry.label}: ${fg} on ${bg} fails 4.5:1 contrast (${ratio(colors[fg],colors[bg]).toFixed(2)}:1)`);
  }
  if (!Array.isArray(theme.tokenColors) || !theme.tokenColors.length) fail(`${entry.label}: syntax token colors are missing`);
  if (!theme.semanticTokenColors || !Object.keys(theme.semanticTokenColors).length) fail(`${entry.label}: semantic token colors are missing`);
}
if (names.size < 4) fail(`expected at least four selectable editions; found ${names.size}`);
const fixtureDir = path.join(root,'tests','syntax');
for (const fixture of ['typescript.ts','python.py','rust.rs']) if (!fs.existsSync(path.join(fixtureDir,fixture))) fail(`required language fixture missing: ${fixture}`);
if (process.exitCode) process.exit(1);
console.log(`Theme editions validated: ${[...names].join(', ')}. Core text contrast meets 4.5:1.`);
