// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import runWithK6 from './commands/run';
import detect from './commands/detect';
import openSettings from './commands/settings';

const addCommand = (
  context: vscode.ExtensionContext,
  name: string,
  action: () => void
) => {
  const entry = vscode.commands.registerCommand(name, action);
  context.subscriptions.push(entry);
};

const addEditorCommand = (
  context: vscode.ExtensionContext,
  name: string,
  action: () => void
) => {
  const entry = vscode.commands.registerTextEditorCommand(name, action);
  context.subscriptions.push(entry);
};

export function activate(context: vscode.ExtensionContext) {
  detect();

  addEditorCommand(context, 'k6.runWithK6', () => runWithK6(false));
  addEditorCommand(context, 'k6.runWithK6Cloud', () => runWithK6(true));
  addCommand(context, 'k6.openSettings', () => openSettings());
}

// this method is called when your extension is deactivated
export function deactivate() {}
