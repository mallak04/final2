import { motion } from 'framer-motion';

interface ChevronStatProps {
  value: number | string;
  label: string;
  subtitle: string;
  delay?: number;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function ChevronStat({
  value,
  label,
  subtitle,
  delay = 0,
  isFirst = false,
  isLast = false
}: ChevronStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="relative flex-1"
      style={{ minWidth: '200px' }}
    >
      {/* Chevron Shape */}
      <div className="relative h-32">
        {/* Main chevron body */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
          >
            {/* Top green section (40% height) */}
            <path
              d={
                isFirst
                  ? "M 0,0 L 180,0 L 200,20 L 180,40 L 0,40 Z"
                  : "M 20,0 L 180,0 L 200,20 L 180,40 L 20,40 L 0,20 Z"
              }
              className="fill-accent-green"
            />

            {/* Bottom section (60% height) */}
            <path
              d={
                isFirst
                  ? isLast
                    ? "M 0,40 L 180,40 L 180,100 L 0,100 Z"
                    : "M 0,40 L 180,40 L 200,60 L 200,80 L 180,100 L 0,100 Z"
                  : isLast
                    ? "M 20,40 L 180,40 L 180,100 L 20,100 L 0,60 L 0,80 Z"
                    : "M 20,40 L 180,40 L 200,60 L 200,80 L 180,100 L 20,100 L 0,60 L 0,80 Z"
              }
              className="fill-light-elevated dark:fill-dark-elevated"
            />

            {/* Border outline */}
            <path
              d={
                isFirst
                  ? isLast
                    ? "M 0,0 L 180,0 L 180,100 L 0,100 Z"
                    : "M 0,0 L 180,0 L 200,20 L 200,80 L 180,100 L 0,100 Z"
                  : isLast
                    ? "M 20,0 L 180,0 L 180,100 L 20,100 L 0,60 L 0,80 L 20,100 L 20,40 L 0,20 Z"
                    : "M 20,0 L 180,0 L 200,20 L 200,80 L 180,100 L 20,100 L 0,80 L 0,20 Z"
              }
              fill="none"
              className="stroke-light-border dark:stroke-dark-border"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          {/* Value */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
          >
            {value}
          </motion.div>

          {/* Label */}
          <div className="text-center">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
              {label}
            </h3>
            <p className="text-xs text-gray-600 dark:text-text-secondary">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
