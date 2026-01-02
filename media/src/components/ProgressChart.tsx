import { motion } from 'framer-motion';
import { TrendingDown, BarChart3 } from 'lucide-react';

interface ProgressData {
  date: string;
  errors: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const maxErrors = Math.max(...data.map((d) => d.errors));
  const minErrors = Math.min(...data.map((d) => d.errors));
  const avgErrors = (data.reduce((sum, d) => sum + d.errors, 0) / data.length).toFixed(1);

  const improvement = data.length >= 2
    ? ((data[0].errors - data[data.length - 1].errors) / data[0].errors * 100).toFixed(0)
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Progress Tracking</h2>
            <p className="text-blue-100 text-sm mt-1">Your improvement over time</p>
          </div>
          <BarChart3 className="w-8 h-8 text-white/80" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-xs font-medium text-green-600 mb-1">Improvement</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-green-700">{improvement}%</span>
              <TrendingDown className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-xs font-medium text-blue-600 mb-1">Avg Errors</div>
            <div className="text-2xl font-bold text-blue-700">{avgErrors}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-xs font-medium text-purple-600 mb-1">Best Score</div>
            <div className="text-2xl font-bold text-purple-700">{minErrors}</div>
          </div>
        </div>

        <div className="relative h-48 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const heightPercentage = (item.errors / maxErrors) * 100;
            return (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg relative group cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-colors"
                  style={{ minHeight: '20px' }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.errors} errors
                  </div>
                </motion.div>
                <span className="text-xs text-gray-600 font-medium">{formatDate(item.date)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
