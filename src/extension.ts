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

  const sendCodeToWebview = () => {
    if (!currentPanel) {
      console.log('ERROR: No current panel to send to');
      return;
    }

    const message = {
      type: 'updateCode',
      code,
      language,
      fileName
    };

    console.log('Attempting to send message to webview:', {
      fileName,
      codeLength: code.length,
      language,
      messageType: message.type
    });

    try {
      currentPanel.webview.postMessage(message);
      console.log('✓ Message sent successfully');
    } catch (error) {
      console.error('✗ Failed to send message:', error);
    }
  };

  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.Beside);
    // Send immediately when reusing panel
    sendCodeToWebview();
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

    // Listen for webview ready message
    currentPanel.webview.onDidReceiveMessage(
      message => {
        if (message.type === 'webviewReady') {
          console.log('Webview ready, sending code...');
          sendCodeToWebview();
        }
      }
    );

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });

    // Also send after delay as fallback
    setTimeout(() => {
      sendCodeToWebview();
    }, 1500);
  }
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

  // Generate webview URIs for SVG assets
  const logoUri = webview.asWebviewUri(vscode.Uri.file(path.join(distPath, 'logo.svg')));
  const analysisUri = webview.asWebviewUri(vscode.Uri.file(path.join(distPath, 'analysis.svg')));

  // Add CSP to allow scripts and API calls
  const csp = `
    <meta http-equiv="Content-Security-Policy" content="default-src 'none';
    connect-src http://localhost:8000 http://127.0.0.1:8000;
    img-src ${webview.cspSource} https: data:;
    script-src ${webview.cspSource} 'unsafe-inline';
    style-src ${webview.cspSource} 'unsafe-inline' https:;
    font-src ${webview.cspSource} https:;">`;

  html = html.replace('</head>', `${csp}</head>`);

  // Add script to initialize vscodeApi and inject SVG assets
  const initScript = `
    <script>
      console.log('🟢 INLINE SCRIPT IS RUNNING!');
      console.log('acquireVsCodeApi type:', typeof acquireVsCodeApi);

      // Test if we can receive messages WITHOUT acquireVsCodeApi
      window.addEventListener('message', function(event) {
        console.log('🟢 INLINE SCRIPT received message:', event.data);
      });

      if (typeof acquireVsCodeApi !== 'undefined') {
        window.vscodeApi = acquireVsCodeApi();
        console.log('✓ VS Code API initialized');
      } else {
        console.error('✗ acquireVsCodeApi not available');
      }

      // Add SVG assets AFTER vscodeApi initialization
      window.VSCODE_ASSETS = {
        logo: "${logoUri}",
        analysis: "${analysisUri}"
      };
      console.log('✓ SVG assets injected:', window.VSCODE_ASSETS);
    </script>`;

  html = html.replace('<body>', `<body>${initScript}`);

  // Debug: Log a snippet of the HTML to verify injection
  console.log('=== GENERATED HTML (first 1000 chars) ===');
  console.log(html.substring(0, 1000));
  console.log('=== Does it contain vscodeApi? ===', html.includes('vscodeApi'));

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