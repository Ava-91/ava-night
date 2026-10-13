const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const base = JSON.parse(fs.readFileSync(path.join(root, 'themes', 'ava-night-base.json'), 'utf8'));
const themes = [
  ['Ava Night', 'themes/ava-night.json'],
  ['Ava Night — Moonlit', 'themes/ava-night-moonlit.json'],
  ['Ava Night — Eclipse', 'themes/ava-night-eclipse.json'],
  ['Ava Night — Afterglow', 'themes/ava-night-afterglow.json'],
];

function luminance(hex) {
  const rgb = hex.slice(1, 7).match(/../g).map((part) => parseInt(part, 16) / 255);
  const linear = rgb.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test('every theme family member is registered in package metadata', () => {
  const contributions = pkg.contributes.themes;
  for (const [label, file] of themes) {
    assert.ok(contributions.some((entry) => entry.label === label && entry.path === \`./\${file}\` && entry.uiTheme === 'vs-dark'), \`missing contribution: \${label}\`);
    assert.ok(fs.existsSync(path.join(root, file)), \`missing theme file: \${file}\`);
  }
});

test('every theme variant has valid JSON, the shared base, and core UI colors', () => {
  for (const [label, file] of themes) {
    const theme = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
    assert.equal(theme.name, label, \`\${label}: theme name\`);
    if (file !== 'themes/ava-night.json') {
      assert.equal(theme.include, './ava-night-base.json', \`\${label}: shared base\`);
    }
    for (const key of ['editor.background', 'editor.foreground', 'sideBar.background', 'panel.background', 'terminal.background']) {
      const color = theme.colors?.[key] ?? base.colors?.[key];
      assert.match(color ?? '', /^#[0-9a-f]{6}$/i, \`\${label}: valid \${key}\`);
    }
  }
});

test('editor text and key interface states retain readable contrast in every variant', () => {
  for (const [label, file] of themes) {
    const theme = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
    const colors = { ...base.colors, ...(theme.colors || {}) };
    const pairs = [
      ['editor.foreground', 'editor.background', 4.5],
      ['sideBar.foreground', 'sideBar.background', 4.5],
      ['terminal.foreground', 'terminal.background', 4.5],
      ['statusBar.foreground', 'statusBar.background', 4.5],
      ['button.foreground', 'button.background', 4.5],
      ['editorLineNumber.activeForeground', 'editor.background', 3],
      ['focusBorder', 'editor.background', 3],
    ];
    for (const [foreground, background, minimum] of pairs) {
      assert.ok(colors[foreground] && colors[background], \`\${label}: missing contrast pair \${foreground} / \${background}\`);
      const ratio = contrast(colors[foreground], colors[background]);
      assert.ok(ratio >= minimum, \`\${label}: \${foreground} / \${background} contrast \${ratio.toFixed(2)}:1 is below \${minimum}:1\`);
    }
  }
});

test('each variant keeps the same semantic role coverage as the core theme', () => {
  const required = ['function', 'method', 'keyword', 'class', 'interface', 'type', 'string', 'number', 'variable', 'property', 'comment'];
  for (const [label, file] of themes) {
    const theme = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
    const semantic = { ...(base.semanticTokenColors || {}), ...(theme.semanticTokenColors || {}) };
    for (const token of required) {
      assert.ok(semantic[token], \`\${label}: missing semantic role \${token}\`);
    }
  }
});

test('the constellation brand asset is present and contains no embedded raster data', () => {
  const asset = fs.readFileSync(path.join(root, '.github', 'assets', 'constellation.svg'), 'utf8');
  assert.match(asset, /<svg\b/);
  assert.match(asset, /viewBox=/);
  assert.doesNotMatch(asset, /data:image\/|<script\b/i);
});
