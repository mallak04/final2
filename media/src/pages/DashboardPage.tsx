import { motion } from 'framer-motion';
import HistoryList from '../components/HistoryList';
import ProgressChart from '../components/ProgressChart';
import { mockHistory, mockProgressData } from '../data/mockData';
import { Award, TrendingUp, Code2 } from 'lucide-react';

export default function DashboardPage() {
  const totalAnalyses = mockHistory.length;
  const totalErrors = mockHistory.reduce((sum, item) => sum + item.total_errors, 0);
  const avgErrors = (totalErrors / totalAnalyses).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
        <p className="text-gray-600">Track your coding progress and view analysis history</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Code2 className="w-8 h-8" />
            <span className="text-3xl font-bold">{totalAnalyses}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Total Analyses</h3>
          <p className="text-blue-100 text-sm">Code reviews completed</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-3xl font-bold">{avgErrors}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Avg Errors</h3>
          <p className="text-purple-100 text-sm">Per analysis session</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <span className="text-3xl font-bold">
              {Math.round((1 - totalErrors / (totalAnalyses * 10)) * 100)}%
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Code Quality</h3>
          <p className="text-amber-100 text-sm">Overall score</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoryList history={mockHistory} />
        <ProgressChart data={mockProgressData} />
      </div>
    </div>
  );
}
