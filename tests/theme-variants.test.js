const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
function loadTheme(entry) {
  const file=path.join(root,entry.path);
  const child=JSON.parse(fs.readFileSync(file,'utf8'));
  if (!child.include) return child;
  const basePath=path.resolve(path.dirname(file),child.include);
  const base=JSON.parse(fs.readFileSync(basePath,'utf8'));
  return {...base,...child,colors:{...(base.colors||{}),...(child.colors||{})},semanticTokenColors:{...(base.semanticTokenColors||{}),...(child.semanticTokenColors||{})},tokenColors:child.tokenColors||base.tokenColors};
}
function luminance(hex) {
  const values = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  return values.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
}
function contrast(a,b) { const x=luminance(a), y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
test('theme labels and paths are unique', () => {
  const labels=pkg.contributes.themes.map(t=>t.label);
  assert.equal(new Set(labels).size,labels.length);
  for (const t of pkg.contributes.themes) assert.ok(fs.existsSync(path.join(root,t.path)),t.path);
});
test('each theme has matching metadata, syntax tokens, and semantic tokens', () => {
  for (const entry of pkg.contributes.themes) {
    const theme=loadTheme(entry);
    assert.equal(theme.name,entry.label);
    assert.ok(theme.colors['editor.background']);
    assert.ok(theme.colors['editor.foreground']);
    assert.ok(theme.tokenColors.length>0);
    assert.ok(Object.keys(theme.semanticTokenColors).length>0);
  }
});
test('primary text, sidebar text, and terminal text meet 4.5:1 contrast', () => {
  for (const entry of pkg.contributes.themes) {
    const c=loadTheme(entry).colors;
    for (const [fg,bg] of [['editor.foreground','editor.background'],['sideBar.foreground','sideBar.background'],['terminal.foreground','terminal.background']]) {
      assert.ok(contrast(c[fg],c[bg])>=4.5,`${entry.label}: ${fg} on ${bg}`);
    }
  }
});
test('core TypeScript, Python, and Rust fixtures exist', () => {
  for (const name of ['typescript.ts','python.py','rust.rs']) assert.ok(fs.existsSync(path.join(root,'tests','syntax',name)),name);
});

test('broad language-family syntax fixtures exist for cross-language review', () => {
  const fixtures = [
    'java.java', 'csharp.cs', 'kotlin.kt', 'swift.swift', 'dart.dart',
    'ruby.rb', 'php.php', 'lua.lua', 'r.r', 'julia.jl', 'scala.scala',
    'haskell.hs', 'elixir.ex', 'clojure.clj', 'perl.pl', 'powershell.ps1',
    'Dockerfile', 'terraform.tf', 'graphql.graphql', 'vue.vue', 'svelte.svelte',
    'astro.astro', 'solidity.sol', 'zig.zig', 'ocaml.ml', 'groovy.groovy',
    'protobuf.proto', 'sample.tex', 'sample.toml', 'sample.ini', 'sample.diff',
    'Makefile'
  ];
  for (const name of fixtures) {
    assert.ok(fs.existsSync(path.join(root, 'tests', 'syntax', name)), name);
  }
});
