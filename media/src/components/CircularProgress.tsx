import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number | string;
  label: string;
  subtitle: string;
  type?: 'percentage' | 'number';
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

export default function CircularProgress({
  value,
  label,
  subtitle,
  type = 'percentage',
  size = 120,
  strokeWidth = 8,
  delay = 0
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Convert value to number for percentage calculations
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const percentage = type === 'percentage' ? numericValue : 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col items-center gap-4"
    >
      {/* Circular Indicator */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {type === 'percentage' ? (
            // Progress Ring for percentage
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#4ecdc4"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
            />
          ) : (
            // Solid filled circle for numbers
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="#4ecdc4"
            />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.5, type: 'spring', stiffness: 200 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            {type === 'percentage' ? `${numericValue}%` : value}
          </motion.span>
        </div>
      </div>

      {/* Labels */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{label}</h3>
        <p className="text-sm" style={{ color: '#888888' }}>{subtitle}</p>
      </div>
    </motion.div>
  );
}
