import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  // Auto-trigger when saving Python files
  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.languageId === 'python') {
      openDashboard(context);
    }
  });

  // Command to open the dashboard with current code
  let disposable = vscode.commands.registerCommand('abcode.openDashboard', () => {
    openDashboard(context);
  });

  context.subscriptions.push(disposable);
}

function openDashboard(context: vscode.ExtensionContext) {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage('No active editor found. Please open a file first.');
    return;
  }

  // Get the code from the active editor
  const code = editor.document.getText();
  const language = editor.document.languageId;
  const fileName = path.basename(editor.document.fileName);

  // Create or show the webview panel
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.Beside);
    // Send the new code to the existing panel
    currentPanel.webview.postMessage({
      type: 'updateCode',
      code: code,
      language: language,
      fileName: fileName
    });
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      'abcodeDashboard',
      'ABCode Dashboard',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'media', 'dist'))
        ],
        retainContextWhenHidden: true
      }
    );

    // Set the HTML content
    currentPanel.webview.html = getWebviewContent(context, currentPanel.webview);

    // Listen for messages from the webview
    currentPanel.webview.onDidReceiveMessage(
      message => {
        if (message.type === 'webviewReady') {
          // Webview is ready, send the code now
          currentPanel?.webview.postMessage({
            type: 'updateCode',
            code: code,
            language: language,
            fileName: fileName
          });
        }
      },
      undefined,
      context.subscriptions
    );

    // Fallback: also send after delay in case ready message is missed
    setTimeout(() => {
      currentPanel?.webview.postMessage({
        type: 'updateCode',
        code: code,
        language: language,
        fileName: fileName
      });
    }, 1000);

    // Reset when the panel is closed
    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined;
      },
      null,
      context.subscriptions
    );
  }
}

function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview): string {
  const distPath = path.join(context.extensionPath, 'media', 'dist');
  const indexPath = path.join(distPath, 'index.html');

  let html = fs.readFileSync(indexPath, 'utf-8');

  // Convert file paths to webview URIs
  const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*><\/script>/g;
  const linkRegex = /<link[^>]+href="([^"]+)"[^>]*>/g;

  html = html.replace(scriptRegex, (match, src) => {
    const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(distPath, src)));
    return match.replace(src, scriptUri.toString());
  });

  html = html.replace(linkRegex, (match, href) => {
    const linkUri = webview.asWebviewUri(vscode.Uri.file(path.join(distPath, href)));
    return match.replace(href, linkUri.toString());
  });

  return html;
}

export function deactivate() {}