#!/usr/bin/env node
// Captures real VS Code screenshots when the installed VS Code build supports --screenshot.
// Set CODE_BIN to the executable and VSIX_PATH to a previously packaged extension if needed.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const code = process.env.CODE_BIN || 'code';
const out = path.join(root, 'tests', 'results', 'screenshots');
const themes = [
  { label: 'ava-night', theme: 'Ava Night' },
  { label: 'moonlit', theme: 'Ava Night — Moonlit' },
  { label: 'eclipse', theme: 'Ava Night — Eclipse' },
  { label: 'afterglow', theme: 'Ava Night — Afterglow' },
];
const fixture = path.join(root, 'tests', 'syntax', 'typescript.ts');
const vsix = process.env.VSIX_PATH || path.join(root, `${require('../package.json').name}-${require('../package.json').version}.vsix`);
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'ava-night-capture-'));
const extensions = path.join(workspace, 'extensions');
const userData = path.join(workspace, 'user-data');
fs.mkdirSync(extensions); fs.mkdirSync(userData, { recursive: true }); fs.mkdirSync(out, { recursive: true });
function run(args) { return spawnSync(code, args, { cwd: root, encoding: 'utf8', timeout: 60000 }); }
if (!fs.existsSync(vsix)) { console.error(`VSIX not found: ${vsix}. Run vsce package --no-dependencies first.`); process.exit(1); }
if (!fs.existsSync(fixture)) { console.error(`Fixture not found: ${fixture}`); process.exit(1); }
const install = run(['--no-sandbox','--disable-gpu','--extensions-dir',extensions,'--install-extension',vsix,'--force']);
if (install.status !== 0) { console.error(install.stderr || install.stdout); process.exit(1); }
const results = [];
for (const item of themes) {
  const settingsDir = path.join(userData, 'User');
  fs.mkdirSync(settingsDir, { recursive: true });
  fs.writeFileSync(path.join(settingsDir,'settings.json'), JSON.stringify({ 'workbench.colorTheme': item.theme }, null, 2));
  const target = path.join(out, `${item.label}.png`);
  const capture = run(['--no-sandbox','--disable-gpu','--user-data-dir',userData,'--extensions-dir',extensions,'--new-window',fixture,'--screenshot',target]);
  const exists = fs.existsSync(target) && fs.statSync(target).size > 0;
  results.push({ theme: item.theme, path: path.relative(root,target), captured: exists, exitCode: capture.status });
  if (!exists) {
    console.error(`Screenshot capture failed for ${item.theme}. This VS Code build may not support --screenshot; see stdout/stderr below.\n${capture.stdout}\n${capture.stderr}`);
    process.exitCode = 1;
  }
}
fs.writeFileSync(path.join(out,'manifest.json'), JSON.stringify({ generatedBy:'tools/capture-screenshots.js', fixture:path.relative(root,fixture), results }, null, 2)+'\n');
if (!process.exitCode) console.log(`Captured ${results.length} screenshots in ${path.relative(root,out)}`);
