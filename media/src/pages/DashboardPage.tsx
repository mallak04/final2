import { motion } from 'framer-motion';
import HistoryList from '../components/HistoryList';
import ProgressChart from '../components/ProgressChart';
import { useState, useEffect } from 'react';
import { fetchProgressData, fetchAnalysisHistory, ProgressData, HistoryItem } from '../services/apiService';
import { Award, TrendingUp, Bot } from 'lucide-react';

export default function DashboardPage() {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual user ID from authentication
  const userId = "test-user";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [history, progress] = await Promise.all([
          fetchAnalysisHistory(userId),
          fetchProgressData(userId)
        ]);

        setHistoryData(history);
        setProgressData(progress);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const totalAnalyses = historyData.length;
  const totalErrors = historyData.reduce((sum, item) => sum + item.total_errors, 0);
  const avgErrors = totalAnalyses > 0 ? (totalErrors / totalAnalyses).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">Your Dashboard</h1>
        <p className="text-gray-600 dark:text-text-secondary">Track your coding progress and view analysis history</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -8 }}
          className="bg-accent-teal rounded-xl p-6 text-white shadow-lg cursor-pointer border-2 border-transparent hover:border-white/30 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Bot className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">
              {totalAnalyses}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Total Analyses</h3>
          <p className="text-white/80 text-sm">Code reviews completed</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -8 }}
          className="bg-accent-cyan rounded-xl p-6 text-white shadow-lg cursor-pointer border-2 border-transparent hover:border-white/30 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <TrendingUp className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">
              {avgErrors}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Avg Errors</h3>
          <p className="text-white/80 text-sm">Per analysis session</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -8 }}
          className="bg-accent-green rounded-xl p-6 text-white shadow-lg cursor-pointer border-2 border-transparent hover:border-white/30 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Award className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">
              {Math.round((1 - totalErrors / (totalAnalyses * 10)) * 100)}%
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Code Quality</h3>
          <p className="text-white/80 text-sm">Overall score</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoryList history={historyData} />
        <ProgressChart data={progressData} />
      </div>
    </div>
  );
}
