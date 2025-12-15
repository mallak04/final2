import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, BarChart3, Award, PieChart, BarChart, BarChartHorizontal, Sparkles, Trophy, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchProgressData, fetchAnalysisHistory, fetchMonthlyErrorBreakdown, ProgressData, HistoryItem, MonthlyErrorBreakdown } from '../services/apiService';

export default function ProgressPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlyErrorBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual user ID from authentication
  const userId = "test-user";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [progress, history, breakdown] = await Promise.all([
          fetchProgressData(userId),
          fetchAnalysisHistory(userId),
          fetchMonthlyErrorBreakdown(userId)
        ]);

        setProgressData(progress);
        setHistoryData(history);
        setMonthlyBreakdown(breakdown);
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const maxErrors = progressData.length > 0 ? Math.max(...progressData.map((d) => d.errors)) : 0;
  const minErrors = progressData.length > 0 ? Math.min(...progressData.map((d) => d.errors)) : 0;
  const avgErrors = progressData.length > 0
    ? (progressData.reduce((sum, d) => sum + d.errors, 0) / progressData.length).toFixed(1)
    : '0';

  const improvement = progressData.length >= 2
    ? ((progressData[0].errors - progressData[progressData.length - 1].errors) / progressData[0].errors * 100).toFixed(0)
    : 0;

  const totalAnalyses = historyData.length;
  const totalErrorsHistory = historyData.reduce((sum, item) => sum + item.total_errors, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Color mapping for error categories - subtle/muted colors
  const categoryColors: { [key: string]: string } = {
    "Brackets": "#8b9dc3",
    "Commas": "#a78bca",
    "Indentation": "#7ea3cc",
    "Case & Spelling": "#6b9e9e",
    "Missing/Wrong Colon": "#c4a572",
    "Other Errors": "#7daa92",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300 pb-24 px-4 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-text-secondary">Loading progress data...</p>
        </div>
      </div>
    );
  }

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
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-light-surface dark:bg-dark-surface border-2 rounded-xl p-6 transition-all shadow-lg cursor-pointer relative overflow-hidden ${
              Number(improvement) > 0
                ? 'border-accent-green hover:border-accent-green'
                : 'border-light-border dark:border-dark-border hover:border-accent-green'
            }`}
          >
            {/* Celebratory Background Effect */}
            {Number(improvement) > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-accent-green/20 via-transparent to-accent-cyan/20"
                />
                {/* Floating Stars */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 0.8 }}
                    animate={{
                      y: [-10, -30],
                      opacity: [0.8, 0],
                      x: [0, (i - 1) * 10]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut"
                    }}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <Sparkles className="w-4 h-4 text-accent-green" />
                  </motion.div>
                ))}
              </>
            )}

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                Number(improvement) > 0 ? 'bg-accent-green/20' : 'bg-accent-green/10'
              }`}>
                {Number(improvement) > 0 ? (
                  <Trophy className="w-6 h-6 text-accent-green" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-accent-green" />
                )}
              </div>
              <span className={`text-3xl font-bold ${Number(improvement) >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
                {improvement}%
              </span>
            </div>

            {/* Celebratory Message */}
            {Number(improvement) > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-accent-green fill-accent-green" />
                  <h3 className="text-lg font-bold text-accent-green">Congratulations!</h3>
                </div>
                <p className="text-gray-600 dark:text-text-secondary text-sm font-medium">
                  You've improved your code quality! Keep up the great work!
                </p>
              </motion.div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-1">Improvement</h3>
                <p className="text-gray-600 dark:text-text-secondary text-sm">Error reduction rate</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-xl p-6 hover:border-accent-teal transition-all shadow-lg cursor-pointer"
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
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-xl p-6 hover:border-accent-cyan transition-all shadow-lg cursor-pointer"
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

        {/* Error Type Pie Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-lg mb-8"
        >
          <div className="bg-accent-teal px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChartHorizontal className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-semibold text-white">Error Type Distribution</h2>
                <p className="text-white/80 text-sm">Overall percentage breakdown by category</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Legend */}
            <div className="mb-6 flex flex-wrap gap-3 justify-center">
              {Object.entries(categoryColors).map(([category, color]) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${
                    hoveredCategory === category || hoveredCategory === null
                      ? 'opacity-100'
                      : 'opacity-40'
                  }`}
                  style={{
                    borderColor: color,
                    backgroundColor: `${color}15`,
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-text-primary">{category}</span>
                </motion.button>
              ))}
            </div>

            {/* Stacked Percentage Bars */}
            <div className="space-y-6">
              {monthlyBreakdown.map((monthData, monthIndex) => {
                const percentages = Object.entries(monthData.categories).map(([category, count]) => ({
                  category,
                  count,
                  percentage: monthData.total > 0 ? (count / monthData.total) * 100 : 0,
                }));

                return (
                  <motion.div
                    key={monthData.month}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + monthIndex * 0.1 }}
                    className="group"
                    onMouseEnter={() => setSelectedMonth(monthIndex)}
                    onMouseLeave={() => setSelectedMonth(null)}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-text-primary w-32">
                        {monthData.month.split(' ')[0]}
                      </h3>
                      <div className="flex-1 h-12 bg-light-elevated dark:bg-dark-elevated rounded-lg overflow-hidden flex border-2 border-light-border dark:border-dark-border transition-all group-hover:border-accent-teal">
                        {percentages.map((item, index) => {
                          const isHighlighted = hoveredCategory === null || hoveredCategory === item.category;
                          return item.percentage > 0 ? (
                            <motion.div
                              key={item.category}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ delay: 0.6 + monthIndex * 0.1 + index * 0.05, duration: 0.5 }}
                              className="relative group/bar cursor-pointer transition-all"
                              style={{
                                backgroundColor: categoryColors[item.category],
                                opacity: isHighlighted ? 1 : 0.3,
                                filter: isHighlighted ? `drop-shadow(0 0 8px ${categoryColors[item.category]})` : 'none',
                              }}
                            >
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                <p>{item.category}</p>
                                <p className="text-accent-teal">{item.percentage.toFixed(1)}% ({item.count} errors)</p>
                                <div
                                  className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"
                                />
                              </div>
                              {/* Percentage label inside bar */}
                              {item.percentage > 8 && (
                                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                  {item.percentage.toFixed(0)}%
                                </span>
                              )}
                            </motion.div>
                          ) : null;
                        })}
                      </div>
                      <span className="text-sm font-bold text-gray-600 dark:text-text-secondary w-16 text-right">
                        {monthData.total} total
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
