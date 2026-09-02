const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const resultsDir = path.join(root, 'tests', 'results');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const expectedVsix = path.join(root, `${pkg.name}-${pkg.version}.vsix`);

function fail(message) {
  console.error(`VSIX smoke test failed: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(expectedVsix)) {
  fail(`expected package not found: ${path.basename(expectedVsix)}`);
  process.exit();
}

const listing = spawnSync('unzip', ['-Z1', expectedVsix], { cwd: root, encoding: 'utf8' });
if (listing.error || listing.status !== 0) {
  fail(`could not inspect VSIX archive: ${listing.stderr || listing.error?.message || 'unknown error'}`);
  process.exit();
}

const entries = listing.stdout.trim().split(/\r?\n/).filter(Boolean);
const required = [
  'extension/package.json',
  'extension/themes/ava-night.json',
  'extension/themes/ava-night-base.json',
  'extension/themes/palette.json',
];

for (const entry of required) {
  if (!entries.includes(entry)) fail(`missing required VSIX entry: ${entry}`);
}

const packageJson = spawnSync('unzip', ['-p', expectedVsix, 'extension/package.json'], { cwd: root, encoding: 'utf8' });
if (packageJson.status !== 0) fail(`could not read packaged package.json: ${packageJson.stderr}`);
else {
  const packaged = JSON.parse(packageJson.stdout);
  for (const field of ['name', 'displayName', 'version', 'publisher']) {
    if (packaged[field] !== pkg[field]) fail(`package metadata drift for ${field}: ${packaged[field]} !== ${pkg[field]}`);
  }
}

const report = {
  status: process.exitCode ? 'fail' : 'pass',
  package: path.basename(expectedVsix),
  version: pkg.version,
  requiredEntries: required,
  entryCount: entries.length,
};
fs.mkdirSync(resultsDir, { recursive: true });
fs.writeFileSync(path.join(resultsDir, 'vsix-smoke-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (!process.exitCode) console.log(`VSIX smoke test passed: ${path.basename(expectedVsix)} contains the expected extension payload and matching metadata.`);
