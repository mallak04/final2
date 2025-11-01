import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import AnalysisPage from './pages/AnalysisPage';
import ProfilePage from './pages/ProfilePage';
import ChatbotPage from './pages/ChatbotPage';
import BottomNavigation from './components/BottomNavigation';

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

type Page = 'analysis' | 'profile' | 'chatbot';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('analysis');
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

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <AnimatePresence mode="wait">
        {currentPage === 'analysis' && (
          <motion.div
            key="analysis"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <AnalysisPage codeData={codeData} />
          </motion.div>
        )}

        {currentPage === 'profile' && (
          <motion.div
            key="profile"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ProfilePage />
          </motion.div>
        )}

        {currentPage === 'chatbot' && (
          <motion.div
            key="chatbot"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ChatbotPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;