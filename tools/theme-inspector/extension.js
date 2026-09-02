const vscode = require('vscode');
const fs = require('node:fs');
const path = require('node:path');

function tokenName(legend, index) {
  return legend?.tokenTypes?.[index] ?? `tokenType#${index}`;
}

function decodeTokens(data, legend) {
  const result = [];
  for (let i = 0; i + 4 < data.length; i += 5) {
    const line = data[i];
    const start = data[i + 1];
    const length = data[i + 2];
    const tokenType = data[i + 3] & 0xffff;
    const modifiers = data[i + 4];
    result.push({ line: line + 1, start, length, token: tokenName(legend, tokenType), modifiers });
  }
  return result;
}

async function inspectDocument(document) {
  const uri = document.uri;
  let legend = null;
  let semanticTokens = null;
  try {
    legend = await vscode.commands.executeCommand('vscode.executeDocumentSemanticTokensLegend', uri);
  } catch (error) {
    legend = { error: String(error) };
  }
  try {
    semanticTokens = await vscode.commands.executeCommand('vscode.executeDocumentSemanticTokens', uri);
  } catch (error) {
    semanticTokens = { error: String(error) };
  }

  const data = semanticTokens?.data;
  return {
    file: vscode.workspace.asRelativePath(uri),
    languageId: document.languageId,
    legend,
    tokenCount: data instanceof Uint32Array ? data.length / 5 : 0,
    tokens: data instanceof Uint32Array ? decodeTokens(data, legend) : [],
    error: semanticTokens?.error ?? null,
  };
}

async function run() {
  const workspace = vscode.workspace.workspaceFolders?.[0];
  if (!workspace) throw new Error('Open the Ava Night repository as a VS Code workspace first.');

  const fixtureDir = path.join(workspace.uri.fsPath, 'tests', 'syntax');
  const resultsDir = path.join(workspace.uri.fsPath, 'tests', 'results');
  fs.mkdirSync(resultsDir, { recursive: true });

  const files = fs.readdirSync(fixtureDir)
    .filter((file) => !file.startsWith('.'))
    .sort();

  const results = [];
  for (const file of files) {
    const uri = vscode.Uri.file(path.join(fixtureDir, file));
    const document = await vscode.workspace.openTextDocument(uri);
    results.push(await inspectDocument(document));
  }

  const report = {
    generatedBy: 'tools/theme-inspector/extension.js',
    generatedAt: new Date().toISOString(),
    workspace: workspace.name,
    files: results,
  };

  const output = path.join(resultsDir, 'semantic-tokens.json');
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  vscode.window.showInformationMessage(`Ava Night diagnostics written to ${vscode.workspace.asRelativePath(output)}`);
}

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('avaNight.inspectTheme', () => run().catch((error) => vscode.window.showErrorMessage(`Ava Night inspector: ${error.message}`))));
}

function deactivate() {}

module.exports = { activate, deactivate };
