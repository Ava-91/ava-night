const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const matrix = JSON.parse(fs.readFileSync(path.join(root, 'tests', 'language-matrix.json'), 'utf8'));

const expectedColors = {
  'Ava Night': { primary: '#7FDBFF', secondary: '#61AFEF', constant: '#FFD166' },
  'Ava Night — Moonlit': { primary: '#78DCE8', secondary: '#86B7E8', constant: '#F4D58D' },
  'Ava Night — Eclipse': { primary: '#B99AFF', secondary: '#D6A5FF', constant: '#F0C987' },
  'Ava Night — Afterglow': { primary: '#9BD7C1', secondary: '#B9D9A8', constant: '#E8D18A' },
};

const scopeGroups = {
  primary: ['variable', 'variable.other', 'variable.other.readwrite', 'variable.other.member', 'variable.other.object', 'variable.other.assignment', 'variable.language', 'entity.name.variable', 'meta.definition.variable'],
  secondary: ['variable.parameter', 'variable.parameter.function', 'variable.other.property', 'variable.other.custom-property', 'meta.object-literal.key', 'support.variable', 'meta.function.parameters', 'support.type.property-name'],
  constant: ['variable.other.constant', 'variable.other.enummember'],
};
const semanticGroups = {
  primary: ['variable', 'variable.defaultLibrary', 'variable.mutable', 'property.readonly'],
  secondary: ['variable.readonly', 'variable.member', 'property', 'property.defaultLibrary', 'parameter', 'parameter.readonly'],
  constant: ['variable.constant'],
};

function loadTheme(entry) {
  const file = path.join(root, entry.path);
  const child = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!child.include) return child;
  const base = JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), child.include), 'utf8'));
  return {
    ...base, ...child,
    colors: { ...(base.colors || {}), ...(child.colors || {}) },
    semanticTokenColors: { ...(base.semanticTokenColors || {}), ...(child.semanticTokenColors || {}) },
    tokenColors: child.tokenColors || base.tokenColors,
  };
}

test('language matrix covers every fixture and every fixture is tracked', () => {
  const syntaxDir = path.join(root, 'tests', 'syntax');
  const actual = fs.readdirSync(syntaxDir).filter(name => !name.startsWith('.')).sort();
  const expected = [...matrix.fixtures].sort();
  assert.equal(new Set(expected).size, expected.length, 'language matrix contains duplicate fixture names');
  assert.deepEqual(actual, expected, 'language matrix must match the syntax fixture directory exactly');
  for (const name of expected) assert.ok(fs.statSync(path.join(syntaxDir, name)).isFile(), name);
  for (const important of ['python.py', 'typescript.ts', 'react.tsx', 'jsx.jsx', 'javascript.js', 'css.css', 'html.html', 'php.php']) {
    assert.ok(expected.includes(important), 'priority fixture missing from matrix: ' + important);
  }
});

test('all theme editions use accent colors instead of editor-white for variables and properties', () => {
  for (const entry of pkg.contributes.themes) {
    const theme = loadTheme(entry);
    const palette = expectedColors[entry.label];
    assert.ok(palette, 'missing expected variable palette for ' + entry.label);
    const scopes = new Map();
    for (const rule of theme.tokenColors || []) {
      const foreground = rule.settings && rule.settings.foreground;
      for (const scope of rule.scope ? (Array.isArray(rule.scope) ? rule.scope : [rule.scope]) : []) {
        if (foreground) scopes.set(scope, foreground.toUpperCase());
      }
    }
    for (const [group, names] of Object.entries(scopeGroups)) {
      for (const name of names) assert.equal(scopes.get(name), palette[group], entry.label + ': TextMate scope ' + name);
    }
    for (const [group, names] of Object.entries(semanticGroups)) {
      for (const name of names) {
        const value = theme.semanticTokenColors[name];
        const color = (typeof value === 'string' ? value : value && value.foreground || '').toUpperCase();
        assert.equal(color, palette[group], entry.label + ': semantic token ' + name);
        assert.notEqual(color, theme.colors['editor.foreground'].toUpperCase(), entry.label + ': neutral editor foreground leaked into ' + name);
      }
    }
    for (const [name, color] of Object.entries(scopes)) {
      if (/^(variable(\.|$)|meta\.definition\.variable|entity\.name\.variable|support\.variable|meta\.object-literal\.key|support\.type\.property-name)/.test(name)) {
        assert.ok(color !== theme.colors['editor.foreground'].toUpperCase(), entry.label + ': white-like TextMate variable scope ' + name);
      }
    }
  }
});

test('priority language fixtures contain real variable patterns for review', () => {
  const checks = {
    'python.py': [/^def /m, /\bvalues\b/, /\buser_id\b/],
    'typescript.ts': [/\bconst roles\b/, /\bclass UserService\b/, /\bfetchUser\b/],
    'react.tsx': [/<section/, /\bselected\b/, /\bonSelect\b/],
    'jsx.jsx': [/<article/, /\bdisplayName\b/, /\bhandleClick\b/],
    'javascript.js': [/\bconst pattern\b/, /\bconfig\b/, /\bservice\b/],
    'css.css': [/--background/, /--foreground/, /--accent/],
    'html.html': [/onclick=/, /data-theme=/, /<script>/],
    'php.php': [/\$user/, /\$message/, /\$name/],
  };
  for (const [name, patterns] of Object.entries(checks)) {
    const content = fs.readFileSync(path.join(root, 'tests', 'syntax', name), 'utf8');
    for (const pattern of patterns) assert.match(content, pattern, name + ': missing expected syntax sample ' + pattern);
  }
});
