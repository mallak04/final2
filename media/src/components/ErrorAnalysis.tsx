import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ErrorCategory {
  category: string;
  count: number;
  description: string;
  icon: string;
}

interface ErrorAnalysisProps {
  errors: ErrorCategory[];
}

export default function ErrorAnalysis({ errors }: ErrorAnalysisProps) {
  const totalErrors = errors.reduce((sum, error) => sum + error.count, 0);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Error Analysis</h2>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white font-semibold">{totalErrors} issues</span>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {errors.map((error, index) => (
          <motion.div
            key={error.category}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              error.count > 0
                ? 'bg-red-50 border-red-200 hover:border-red-300'
                : 'bg-green-50 border-green-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                  error.count > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {error.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{error.category}</h3>
                  <p className="text-sm text-gray-600">{error.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {error.count > 0 ? (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {error.count}
                  </span>
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
