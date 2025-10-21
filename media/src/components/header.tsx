import { motion } from 'framer-motion';
import { Code2, User } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'analysis' | 'dashboard') => void;
  currentPage: 'analysis' | 'dashboard';
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ABCode
            </h1>
            <p className="text-xs text-gray-500">AI-Powered Code Analyzer</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate(currentPage === 'analysis' ? 'dashboard' : 'analysis')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <User className="w-4 h-4" />
          <span className="font-medium">
            {currentPage === 'analysis' ? 'Dashboard' : 'Back to Analysis'}
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
}
