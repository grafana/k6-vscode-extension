import * as vscode from 'vscode';
import { exec } from 'child_process';

const K6_URL = vscode.Uri.parse('https://k6.io/docs/get-started/installation');
const NOT_DETECTED =
  'Could not find any installation of k6 on your system. For this extension to work, make sure it is available in your PATH';

const onError = async () => {
  const getStartedButton = { title: 'Get started' };
  const output = await vscode.window.showErrorMessage(
    NOT_DETECTED,
    {},
    getStartedButton
  );

  if (output !== getStartedButton) {
    return;
  }

  vscode.commands.executeCommand('vscode.open', K6_URL);
  vscode.window.showInformationMessage('Getting started');
};

const cmd = process.platform === 'win32' ? 'where' : 'which';

export default async () => {
  return new Promise<void>((resolve, reject) =>
    exec(cmd + ' k6', { windowsHide: true }, (err, _) =>
      err ? reject() : resolve()
    )
  )
    .then(() => {})
    .catch(() => onError());
};
