import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';  // ✅ added for running Python

export function activate(context: vscode.ExtensionContext) {
  // ✅ When any Python file is saved
  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.languageId === 'python') {
      runPythonAndOpenDashboard(context);
    }
  });

  // ✅ Manual command to trigger it too
  let disposable = vscode.commands.registerCommand('abcode.openDashboard', () => {
    runPythonAndOpenDashboard(context);
  });

  context.subscriptions.push(disposable);
}

// ✅ This function replaces your old `openDashboard`
function runPythonAndOpenDashboard(context: vscode.ExtensionContext) {
  // 1️⃣ Run the Python script (server.py)
  const pythonCommand = 'python "' + path.join(context.extensionPath, 'server.py') + '"';
  exec(pythonCommand, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage(`Python error: ${error.message}`);
      return;
    }

    vscode.window.showInformationMessage('Python script executed — opening dashboard...');
  });

  // 2️⃣ Open the external dashboard page (from your Python script)
  //    or, if you want to open it directly from the extension, uncomment this:
  /*
  const panel = vscode.window.createWebviewPanel(
    'abcodeDashboard',
    'ABCode Dashboard',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
    }
  );

  const htmlPath = vscode.Uri.file(
    path.join(context.extensionPath, 'media', 'index.html')
  );

  vscode.workspace.fs.readFile(htmlPath).then((data) => {
    panel.webview.html = data.toString();
  });
  */
}

export function deactivate() {}
