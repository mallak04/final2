import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import SecurityAlert from './SecurityAlert';

interface CodeDisplayProps {
  code: string;
}

export default function CodeDisplay({ code }: CodeDisplayProps) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex items-center gap-2">
        <Code className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Your Code</h2>
      </div>

      <div className="p-6">
        <SecurityAlert />
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-100 leading-relaxed">
            {code}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
