import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, BarChart3, AlertCircle, CheckCircle, Award } from 'lucide-react';
import { mockProgressData, mockHistory, mockErrors } from '../data/mockData';

export default function ProgressPage() {
  const progressData = mockProgressData;
  const maxErrors = Math.max(...progressData.map((d) => d.errors));
  const minErrors = Math.min(...progressData.map((d) => d.errors));
  const avgErrors = (progressData.reduce((sum, d) => sum + d.errors, 0) / progressData.length).toFixed(1);

  const improvement = progressData.length >= 2
    ? ((progressData[0].errors - progressData[progressData.length - 1].errors) / progressData[0].errors * 100).toFixed(0)
    : 0;

  const totalAnalyses = mockHistory.length;
  const totalErrorsHistory = mockHistory.reduce((sum, item) => sum + item.total_errors, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300 pb-24 px-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">Progress Tracking</h1>
          <p className="text-gray-600 dark:text-text-secondary">Monitor your coding improvement over time</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-accent-green transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-accent-green" />
              </div>
              <span className={`text-3xl font-bold ${Number(improvement) >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
                {improvement}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-1">Improvement</h3>
            <p className="text-gray-600 dark:text-text-secondary text-sm">Error reduction rate</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-accent-teal transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent-teal" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-text-primary">{avgErrors}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-1">Avg Errors</h3>
            <p className="text-gray-600 dark:text-text-secondary text-sm">Per analysis session</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-6 hover:border-accent-cyan transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-cyan/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-accent-cyan" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-text-primary">{minErrors}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-1">Best Score</h3>
            <p className="text-gray-600 dark:text-text-secondary text-sm">Lowest error count</p>
          </motion.div>
        </div>

        {/* Progress Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-lg mb-8"
        >
          <div className="bg-accent-teal px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-semibold text-white">Error Trend Analysis</h2>
                <p className="text-white/80 text-sm">Your error count over months</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="relative h-64 flex items-end justify-between gap-3">
              {progressData.map((item, index) => {
                const heightPercentage = (item.errors / maxErrors) * 100;
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="w-full bg-accent-teal rounded-t-lg relative group cursor-pointer hover:bg-accent-cyan transition-colors"
                      style={{ minHeight: '30px' }}
                    >
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border px-3 py-2 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        <p className="text-gray-900 dark:text-text-primary">{item.errors} errors</p>
                        <p className="text-text-tertiary text-xs">{formatDate(item.date)}</p>
                      </div>
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">
                        {item.errors}
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-600 dark:text-text-secondary font-medium">{formatDate(item.date)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Error Category Breakdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-lg"
        >
          <div className="bg-accent-cyan px-6 py-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">Error Category Breakdown</h2>
              <p className="text-white/80 text-sm">Distribution of error types</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockErrors.map((error, index) => (
                <motion.div
                  key={error.category}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    error.count > 0
                      ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                      : 'bg-accent-green/5 border-accent-green/30 hover:border-accent-green/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                        error.count > 0 ? 'bg-red-500/10 text-red-400' : 'bg-accent-green/10 text-accent-green'
                      }`}>
                        {error.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-text-primary">{error.category}</h3>
                    </div>
                    {error.count > 0 ? (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {error.count}
                      </span>
                    ) : (
                      <CheckCircle className="w-6 h-6 text-accent-green" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-text-secondary">{error.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
