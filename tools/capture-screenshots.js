#!/usr/bin/env node
// Captures genuine VS Code window screenshots on a virtual X display.
// Requires VS Code plus xdotool and scrot (installed by the screenshot workflow).
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync, spawn } = require('node:child_process');
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
const pkg = require('../package.json');
const vsix = process.env.VSIX_PATH || path.join(root, `${pkg.name}-${pkg.version}.vsix`);
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'ava-night-capture-'));
const extensions = path.join(workspace, 'extensions');
fs.mkdirSync(extensions, { recursive: true });
fs.mkdirSync(out, { recursive: true });

function run(command, args, options = {}) {
  return spawnSync(command, args, { cwd: root, encoding: 'utf8', timeout: 30000, ...options });
}
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function visibleCodeWindows() {
  const result = run('xdotool', ['search', '--onlyvisible', '--class', 'code']);
  return result.status === 0 ? result.stdout.trim().split(/\s+/).filter(Boolean) : [];
}
async function waitForWindow(previousIds = []) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    const fresh = visibleCodeWindows().filter(id => !previousIds.includes(id));
    if (fresh.length) return fresh[fresh.length - 1];
    await wait(500);
  }
  throw new Error('Timed out waiting for a visible VS Code window. Ensure the script runs under xvfb-run.');
}
function closeWindow(id) {
  run('wmctrl', ['-ic', id]);
  run('xdotool', ['windowkill', id]);
}

(async () => {
  if (!fs.existsSync(vsix)) throw new Error(`VSIX not found: ${vsix}. Run vsce package --no-dependencies first.`);
  if (!fs.existsSync(fixture)) throw new Error(`Fixture not found: ${fixture}`);
  for (const command of ['xdotool', 'scrot', 'wmctrl']) {
    const check = run('bash', ['-lc', `command -v ${command}`]);
    if (check.status !== 0) throw new Error(`Required screenshot utility missing: ${command}`);
  }
  const install = run(code, ['--no-sandbox', '--disable-gpu', '--extensions-dir', extensions, '--install-extension', vsix, '--force']);
  if (install.status !== 0) throw new Error(install.stderr || install.stdout || 'Could not install the VSIX into the temporary extension directory.');

  const results = [];
  for (const item of themes) {
    const userData = path.join(workspace, `user-data-${item.label}`);
    const settingsDir = path.join(userData, 'User');
    fs.mkdirSync(settingsDir, { recursive: true });
    fs.writeFileSync(path.join(settingsDir, 'settings.json'), JSON.stringify({
      'workbench.colorTheme': item.theme,
      'workbench.startupEditor': 'none',
      'window.zoomLevel': 0,
      'editor.minimap.enabled': true,
      'editor.fontSize': 14,
      'editor.lineHeight': 22
    }, null, 2) + '\n');

    const priorWindows = visibleCodeWindows();
    const child = spawn(code, [
      '--no-sandbox', '--disable-gpu', '--user-data-dir', userData,
      '--extensions-dir', extensions, '--new-window', fixture
    ], { cwd: root, stdio: 'ignore', detached: true });
    child.unref();

    let windowId;
    try {
      windowId = await waitForWindow(priorWindows);
      run('wmctrl', ['-ir', windowId, '-b', 'remove,maximized_vert,maximized_horz']);
      run('wmctrl', ['-ir', windowId, '-e', '0,0,0,1440,900']);
      run('xdotool', ['windowactivate', '--sync', windowId]);
      await wait(5000);
      const target = path.join(out, `${item.label}.png`);
      const capture = run('scrot', [target]);
      const exists = fs.existsSync(target) && fs.statSync(target).size > 10000;
      results.push({ theme: item.theme, path: path.relative(root, target), captured: exists, exitCode: capture.status });
      if (!exists || capture.status !== 0) throw new Error(`Screenshot capture failed for ${item.theme}: ${capture.stderr || capture.stdout || 'empty screenshot'}`);
    } finally {
      if (windowId) {
        closeWindow(windowId);
        await wait(1500);
      }
    }
  }
  fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({
    generatedBy: 'tools/capture-screenshots.js',
    captureMethod: 'VS Code 1.100.0 window captured from Xvfb using scrot',
    fixture: path.relative(root, fixture),
    results
  }, null, 2) + '\n');
  console.log(`Captured ${results.length} real VS Code screenshots in ${path.relative(root, out)}`);
})().catch(error => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
