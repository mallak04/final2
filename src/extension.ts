import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.languageId === 'python') {
      openDashboard(context);
    }
  });

  const disposable = vscode.commands.registerCommand('abcode.openDashboard', () => {
    openDashboard(context);
  });

  context.subscriptions.push(disposable);
}

async function openDashboard(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage('No active editor found. Please open a file first.');
    return;
  }

  const code = editor.document.getText();
  const language = editor.document.languageId;
  const fileName = path.basename(editor.document.fileName);

  // Try detecting if the Vite dev server is running
  const devServerRunning = await isDevServerRunning('http://localhost:5173');

  const panelOptions: vscode.WebviewPanelOptions & vscode.WebviewOptions = {
    enableScripts: true,
    retainContextWhenHidden: true,
    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media', 'dist'))],
  };

  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.Beside);
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      'abcodeDashboard',
      'ABCode Dashboard',
      vscode.ViewColumn.Beside,
      panelOptions
    );

    if (devServerRunning) {
      // Load live dev server (for debugging)
      currentPanel.webview.html = getDevServerHtml();
    } else {
      // Load built files (for production)
      currentPanel.webview.html = getWebviewContent(context, currentPanel.webview);
    }

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });
  }

  // Send data after short delay
  setTimeout(() => {
    currentPanel?.webview.postMessage({
      type: 'updateCode',
      code,
      language,
      fileName
    });
  }, 800);
}

function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview): string {
  const distPath = path.join(context.extensionPath, 'media', 'dist');
  const indexPath = path.join(distPath, 'index.html');

  let html = fs.readFileSync(indexPath, 'utf-8');

  // Fix script and CSS paths
  html = html.replace(/(src|href)="(.+?)"/g, (_match, attr, filePath) => {
    const fileUri = webview.asWebviewUri(vscode.Uri.file(path.join(distPath, filePath)));
    return `${attr}="${fileUri}"`;
  });

  // Add CSP to allow scripts
  const csp = `
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; 
    img-src ${webview.cspSource} https: data:; 
    script-src ${webview.cspSource}; 
    style-src ${webview.cspSource} 'unsafe-inline';">`;

  html = html.replace('</head>', `${csp}</head>`);

  return html;
}

function getDevServerHtml(): string {
  // Loads the Vite dev server directly
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ABCode (Dev Mode)</title>
    </head>
    <body style="margin:0;padding:0;overflow:hidden">
      <iframe src="http://localhost:5173" frameborder="0" style="width:100%;height:100vh;"></iframe>
    </body>
    </html>
  `;
}

async function isDevServerRunning(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

export function deactivate() {}
