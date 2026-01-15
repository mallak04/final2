import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import AnalysisPage from './pages/AnalysisPage';
import ProfilePage from './pages/ProfilePage';
import ChatbotPage from './pages/ChatbotPage';
import ProgressPage from './pages/ProgressPage';
import BottomNavigation from './components/BottomNavigation';
import { isAuthenticated, getCurrentUser, logout } from './services/authService';

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

type Page = 'analysis' | 'chatbot' | 'progress' | 'profile';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('analysis');
  const [codeData, setCodeData] = useState<CodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Verify token is still valid by fetching current user
          await getCurrentUser();
          setAuthenticated(true);
        } catch (error) {
          // Token expired or invalid
          console.error('Authentication check failed:', error);
          logout();
          setAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Get VS Code API - check both window.vscodeApi (set by extension) and acquireVsCodeApi
    const vscode = (window as any).vscodeApi || window.acquireVsCodeApi?.();

    // Listen for messages from the extension
    const handleMessage = (event: MessageEvent) => {
      console.log('📨 RAW MESSAGE EVENT RECEIVED:', {
        origin: event.origin,
        data: event.data,
        type: typeof event.data,
        hasType: event.data?.type
      });

      const message = event.data;

      if (!message || typeof message !== 'object') {
        console.warn('⚠️ Invalid message format');
        return;
      }

      console.log('✓ Valid message object:', message);

      if (message.type === 'updateCode') {
        console.log('✓ Received code update from extension:');
        console.log('  - File name:', message.fileName);
        console.log('  - Language:', message.language);
        console.log('  - Code length:', message.code?.length || 0);
        console.log('  - Code preview:', message.code?.substring(0, 100));

        setCodeData({
          code: message.code,
          language: message.language,
          fileName: message.fileName
        });

        console.log('✓ Code data state updated');
      } else {
        console.log('ℹ️ Ignoring message type:', message.type);
      }
    };

    console.log('🎧 Adding message event listener');
    window.addEventListener('message', handleMessage);
    console.log('✓ Message listener attached');

    // Signal that the webview is ready - try multiple times to ensure delivery
    if (vscode) {
      console.log('✓ VSCode API available');
      console.log('→ Sending webviewReady signal to extension');
      vscode.postMessage({ type: 'webviewReady' });

      // Send again after a short delay to ensure extension received it
      setTimeout(() => {
        vscode.postMessage({ type: 'webviewReady' });
        console.log('→ Sent webviewReady signal (retry)');
      }, 500);
    } else {
      console.warn('⚠ VSCode API not available - running in browser mode');
      console.warn('Trying alternative method - sending ready via parent.postMessage');

      // Try alternative communication method
      try {
        (window as any).parent?.postMessage({ type: 'webviewReady' }, '*');
        console.log('→ Sent webviewReady via parent.postMessage');
      } catch (e) {
        console.error('Failed to send via parent.postMessage:', e);
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Handle login
  const handleLogin = () => {
    setAuthenticated(true);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    setCurrentPage('analysis');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
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
            <ProfilePage onLogout={handleLogout} />
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

        {currentPage === 'progress' && (
          <motion.div
            key="progress"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ProgressPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;