const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const requested = process.env.RELEASE_VERSION || process.env.GITHUB_REF_NAME || '';
const version = requested.replace(/^v/, '');

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`Invalid release version/tag: ${requested || '(missing)'}`);
}

if (version !== pkg.version) {
  throw new Error(`Release tag/version mismatch: tag=${version}, package.json=${pkg.version}`);
}

if (pkg.private) throw new Error('A publishable extension cannot be marked private.');
if (pkg.name !== 'ava-night') throw new Error(`Unexpected package name: ${pkg.name}`);
if (pkg.publisher !== 'Ava-91') throw new Error(`Unexpected publisher: ${pkg.publisher}`);

console.log(`Release gate passed for Ava Night ${pkg.version}.`);
