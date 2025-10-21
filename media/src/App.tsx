import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import AnalysisPage from './pages/AnalysisPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'analysis' | 'dashboard'>('analysis');

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
            <AnalysisPage />
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
