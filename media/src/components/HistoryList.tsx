import { motion } from 'framer-motion';
import { Calendar, Code2, Eye } from 'lucide-react';

interface HistoryItem {
  id: string;
  date: string;
  language: string;
  total_errors: number;
  code_preview: string;
}

interface HistoryListProps {
  history: HistoryItem[];
}

export default function HistoryList({ history }: HistoryListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Analysis History</h2>
        <p className="text-blue-100 text-sm mt-1">Your past code analyses</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{item.language}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.total_errors === 0
                            ? 'bg-green-100 text-green-700'
                            : item.total_errors < 5
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {item.total_errors} {item.total_errors === 1 ? 'error' : 'errors'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.date)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded px-3 py-2 mt-3">
                    <code className="text-xs text-gray-300 font-mono">{item.code_preview}</code>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="ml-4 p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
