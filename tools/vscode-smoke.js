const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const resultsDir = path.join(root, 'tests', 'results');
const languageMatrix = JSON.parse(fs.readFileSync(path.join(root, 'tests', 'language-matrix.json'), 'utf8'));
const fixtures = languageMatrix.fixtures.map(name => path.join(root, 'tests', 'syntax', name));
const extensionId = 'ava-91.ava-night';
const code = process.env.CODE_BIN || 'code';
const vsix = process.env.VSIX_PATH || path.join(root, 'ava-night.vsix');

function run(args, options = {}) {
  return spawnSync(code, args, {
    cwd: root,
    encoding: 'utf8',
    timeout: options.timeout ?? 30000,
    ...options,
  });
}

function fail(message) {
  console.error(`VS Code smoke test failed: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(vsix)) fail(`VSIX not found: ${vsix}`);
const missingFixtures = fixtures.filter(file => !fs.existsSync(file));
if (missingFixtures.length) fail(`Fixtures not found: ${missingFixtures.map(file => path.relative(root, file)).join(', ')}`);
if (process.exitCode) process.exit();

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'ava-night-vscode-'));
const extensionsDir = path.join(workspace, 'extensions');
const userDataDir = path.join(workspace, 'user-data');
fs.mkdirSync(extensionsDir);
fs.mkdirSync(userDataDir);

const install = run(['--no-sandbox', '--disable-gpu', '--extensions-dir', extensionsDir, '--install-extension', vsix, '--force']);
if (install.status !== 0) fail(`extension installation failed:\n${install.stdout}\n${install.stderr}`);

const listed = run(['--no-sandbox', '--disable-gpu', '--extensions-dir', extensionsDir, '--list-extensions']);
if (listed.status !== 0 || !listed.stdout.toLowerCase().split(/\r?\n/).includes(extensionId)) {
  fail(`installed extension was not listed as ${extensionId}:\n${listed.stdout}\n${listed.stderr}`);
}

const settingsDir = path.join(userDataDir, 'User');
fs.mkdirSync(settingsDir, { recursive: true });
fs.writeFileSync(path.join(settingsDir, 'settings.json'), JSON.stringify({
  'workbench.colorTheme': 'Ava Night',
  'files.associations': { '*.swift.txt': 'swift' },
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
  ...fixtures,
], {
  cwd: root,
  encoding: 'utf8',
  timeout: 15000,
});

// VS Code is intentionally left open by this smoke test; timeout termination is expected.
if (launch.error && launch.error.code !== 'ETIMEDOUT') fail(`VS Code could not launch: ${launch.error.message}`);
if (launch.status !== 0 && launch.status !== 124 && !launch.error) {
  fail(`VS Code exited unexpectedly with ${launch.status}:\n${launch.stdout}\n${launch.stderr}`);
}

const report = {
  status: process.exitCode ? 'fail' : 'pass',
  code,
  extension: extensionId,
  fixtureCount: fixtures.length,
  fixtures: fixtures.map(file => path.relative(root, file)),
  requestedTheme: 'Ava Night',
  launch: {
    timeoutExpected: true,
    exitStatus: launch.status,
  },
};
fs.mkdirSync(resultsDir, { recursive: true });
fs.writeFileSync(path.join(resultsDir, 'vscode-smoke-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (!process.exitCode) console.log(`VS Code smoke test passed: Ava Night installed, selected, and launched with all ${fixtures.length} representative syntax fixtures.`);
