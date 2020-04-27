import * as vscode from 'vscode';

export default (arg = 'k6') => {
  vscode.commands.executeCommand('workbench.action.openSettings', arg);
};
