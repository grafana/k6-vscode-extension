import * as vscode from 'vscode';
import { spawn } from 'child_process';
import openSettings from '../settings';

export default async (inCloud = false) => {
  const currentFile = vscode.window.activeTextEditor?.document.uri;
  if (currentFile?.scheme !== 'file') {
    vscode.window.showErrorMessage(
      'The k6 extension currently only works with files saved on disk'
    );
    return;
  }

  if (
    inCloud &&
    !vscode.workspace.getConfiguration('k6').get('cloudToken') &&
    !process.env.K6_CLOUD_TOKEN
  ) {
    const openSettingsButton = { title: 'Open k6 settings' };
    const action = await vscode.window.showErrorMessage(
      'This option requires you to either have a cloud token added in your environment variables or in the k6 extension settings',
      {},
      openSettingsButton
    );
    if (action === openSettingsButton) {
      openSettings('k6.cloudToken');
    }
    return;
  }

  const channel = vscode.window.createOutputChannel('k6');
  channel.show();
  channel.appendLine('Starting k6...');

  const k6 = spawn('k6', [inCloud ? 'cloud' : 'run', currentFile.fsPath], {
    env: {
      ...process.env,
      K6_CLOUD_TOKEN:
        vscode.workspace.getConfiguration('k6').get('cloudToken') ??
        process.env.K6_CLOUD_TOKEN,
    },
  });

  k6.stdout.on('data', (data) => channel.append(data.toString()));
  k6.stderr.on('data', (data) => channel.append(data.toString()));

  k6.on('error', (e) => {
    if (e.message.includes('ENOENT')) {
      channel.appendLine(
        "Looks like you've not installed k6 into your PATH. Aborting."
      );
    } else {
      channel.appendLine(
        'Something went wrong while launching k6. See the error below for details'
      );
      channel.appendLine(JSON.stringify(e));
    }
  });
  k6.on('exit', (code) => {
    channel.appendLine('k6 exited with exit code ' + code);
  });
};
