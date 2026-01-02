import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, BarChart3, Award, PieChart, BarChart, BarChartHorizontal, Sparkles, Trophy, Star } from 'lucide-react';
import CircularProgress from '../components/CircularProgress';
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2 pb-2 border-b-4 border-accent-teal inline-block">
            Progress Tracking
          </h1>
          <p className="text-gray-600 dark:text-text-secondary mt-4">Monitor your coding improvement over time</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="flex justify-around items-center mb-8 py-8">
          <CircularProgress
            value={Math.max(0, Number(improvement))}
            label="Improvement"
            subtitle="Error reduction rate"
            type="percentage"
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
            value={minErrors}
            label="Best Score"
            subtitle="Lowest error count"
            type="number"
            delay={0.3}
          />
        </div>

        {/* Error Type Pie Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded overflow-hidden shadow-lg mb-8"
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
