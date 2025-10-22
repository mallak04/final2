import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import AnalysisPage from './pages/AnalysisPage';
import DashboardPage from './pages/DashboardPage';

// Type for VS Code API
declare global {
  interface Window {
    acquireVsCodeApi?: () => {
      postMessage: (message: any) => void;
    };
  }
}

interface CodeData {
  code: string;
  language: string;
  fileName: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'analysis' | 'dashboard'>('analysis');
  const [codeData, setCodeData] = useState<CodeData | null>(null);

  useEffect(() => {
    // Get VS Code API if available
    const vscode = window.acquireVsCodeApi?.();

    // Listen for messages from the extension
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === 'updateCode') {
        console.log('Received code update:', message.fileName);
        setCodeData({
          code: message.code,
          language: message.language,
          fileName: message.fileName
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // Signal that the webview is ready
    if (vscode) {
      console.log('Webview ready, signaling to extension');
      vscode.postMessage({ type: 'webviewReady' });
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />

      <AnimatePresence mode="wait">
        {currentPage === 'analysis' ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AnalysisPage codeData={codeData} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;