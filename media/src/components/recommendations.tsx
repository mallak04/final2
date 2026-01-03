import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Recommendations</h2>
      </div>

      <div className="p-6">
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <motion.li
              key={index}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{recommendation}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
