import { motion } from 'framer-motion';
import HistoryList from '../components/HistoryList';
import ProgressChart from '../components/ProgressChart';
import CircularProgress from '../components/CircularProgress';
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

      <div className="flex justify-around items-center mb-8 py-8">
        <CircularProgress
          value={totalAnalyses}
          label="Total Analyses"
          subtitle="Code reviews completed"
          type="number"
          delay={0.1}
        />
        <CircularProgress
          value={avgErrors}
          label="Avg Errors"
          subtitle="Per analysis session"
          type="number"
          delay={0.2}
        />
        <CircularProgress
          value={Math.round((1 - totalErrors / (totalAnalyses * 10)) * 100)}
          label="Code Quality"
          subtitle="Overall score"
          type="percentage"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoryList history={historyData} />
        <ProgressChart data={progressData} />
      </div>
    </div>
  );
}
