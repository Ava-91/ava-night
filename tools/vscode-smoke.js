const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const resultsDir = path.join(root, 'tests', 'results');
const fixture = path.join(root, 'tests', 'syntax', 'javascript.js');
const extensionId = 'ava-91.ava-night';
const code = process.env.CODE_BIN || 'code';
const vsix = process.env.VSIX_PATH || path.join(root, 'ava-night-1.3.0.vsix');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const themeLabels = pkg.contributes.themes.map((entry) => entry.label);

function run(args, options = {}) {
  return spawnSync(code, args, {
    cwd: root,
    encoding: 'utf8',
    timeout: options.timeout ?? 30000,
    ...options,
  });
}

function fail(message) {
  console.error('VS Code smoke test failed: ' + message);
  process.exitCode = 1;
}

if (!fs.existsSync(vsix)) fail('VSIX not found: ' + vsix);
if (!fs.existsSync(fixture)) fail('Fixture not found: ' + fixture);
if (process.exitCode) process.exit();

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'ava-night-vscode-'));
const extensionsDir = path.join(workspace, 'extensions');
fs.mkdirSync(extensionsDir);
const install = run(['--no-sandbox', '--disable-gpu', '--extensions-dir', extensionsDir, '--install-extension', vsix, '--force']);
if (install.status !== 0) fail('extension installation failed:\n' + install.stdout + '\n' + install.stderr);

const listed = run(['--no-sandbox', '--disable-gpu', '--extensions-dir', extensionsDir, '--list-extensions']);
if (listed.status !== 0 || !listed.stdout.toLowerCase().split(/\r?\n/).includes(extensionId)) {
  fail('installed extension was not listed as ' + extensionId + ':\n' + listed.stdout + '\n' + listed.stderr);
}

const launchResults = [];
for (const themeLabel of themeLabels) {
  const userDataDir = path.join(workspace, 'user-data-' + themeLabels.indexOf(themeLabel));
  const settingsDir = path.join(userDataDir, 'User');
  fs.mkdirSync(settingsDir, { recursive: true });
  fs.writeFileSync(path.join(settingsDir, 'settings.json'), JSON.stringify({
    'workbench.colorTheme': themeLabel,
  }, null, 2));

  const launch = spawnSync('xvfb-run', [
    '--auto-servernum',
    code,
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--user-data-dir', userDataDir,
    '--extensions-dir', extensionsDir,
    '--new-window',
    fixture,
  ], {
    cwd: root,
    encoding: 'utf8',
    timeout: 15000,
  });

  const timeoutExpected = Boolean(launch.error && launch.error.code === 'ETIMEDOUT') || launch.status === 124;
  if (launch.error && launch.error.code !== 'ETIMEDOUT') fail(themeLabel + ' could not launch: ' + launch.error.message);
  if (launch.status !== 0 && launch.status !== 124 && !timeoutExpected && !launch.error) {
    fail(themeLabel + ' exited unexpectedly with ' + launch.status + ':\n' + launch.stdout + '\n' + launch.stderr);
  }
  launchResults.push({
    theme: themeLabel,
    timeoutExpected,
    exitStatus: launch.status,
  });
}

const report = {
  status: process.exitCode ? 'fail' : 'pass',
  code,
  extension: extensionId,
  fixture: path.relative(root, fixture),
  themes: themeLabels,
  launches: launchResults,
  note: 'Launch smoke verifies installation and theme selection; it does not perform pixel-level screenshot comparison.',
};
fs.mkdirSync(resultsDir, { recursive: true });
fs.writeFileSync(path.join(resultsDir, 'vscode-smoke-report.json'), JSON.stringify(report, null, 2) + '\n');

if (!process.exitCode) console.log('VS Code smoke test passed: installed the extension and launched the fixture with all ' + themeLabels.length + ' theme editions.');
