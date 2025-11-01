import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, User, MessageCircle } from 'lucide-react';

type Page = 'analysis' | 'profile' | 'chatbot';

interface BottomNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const [hoveredPage, setHoveredPage] = useState<Page | null>(null);

  const navItems = [
    {
      id: 'analysis' as Page,
      label: 'Analysis',
      icon: Code2,
      preview: 'View code analysis, errors, and AI recommendations',
      color: 'accent-teal',
    },
    {
      id: 'profile' as Page,
      label: 'Profile',
      icon: User,
      preview: 'Manage your account settings and preferences',
      color: 'accent-cyan',
    },
    {
      id: 'chatbot' as Page,
      label: 'Chatbot',
      icon: MessageCircle,
      preview: 'Chat with ABCode AI assistant for help',
      color: 'accent-green',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Preview Card */}
      <AnimatePresence>
        {hoveredPage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl p-4 max-w-xs backdrop-blur-lg">
              <div className="flex items-center gap-3 mb-2">
                {navItems.find((item) => item.id === hoveredPage)?.icon && (
                  <div className={`w-10 h-10 bg-${navItems.find((item) => item.id === hoveredPage)?.color}/10 rounded-lg flex items-center justify-center`}>
                    {(() => {
                      const Icon = navItems.find((item) => item.id === hoveredPage)?.icon;
                      return Icon ? <Icon className={`w-5 h-5 text-${navItems.find((item) => item.id === hoveredPage)?.color}`} /> : null;
                    })()}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-text-primary">
                  {navItems.find((item) => item.id === hoveredPage)?.label}
                </h3>
              </div>
              <p className="text-sm text-text-secondary">
                {navItems.find((item) => item.id === hoveredPage)?.preview}
              </p>

              {/* Mini preview based on page */}
              <div className="mt-3 rounded-lg overflow-hidden bg-dark-elevated border border-dark-border p-3">
                {hoveredPage === 'analysis' && (
                  <div className="space-y-2">
                    <div className="h-2 bg-accent-teal/20 rounded w-3/4"></div>
                    <div className="h-2 bg-accent-teal/20 rounded w-1/2"></div>
                    <div className="h-2 bg-accent-teal/20 rounded w-2/3"></div>
                  </div>
                )}
                {hoveredPage === 'profile' && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-cyan/20 rounded-full"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-2 bg-accent-cyan/20 rounded w-2/3"></div>
                      <div className="h-2 bg-accent-cyan/20 rounded w-1/2"></div>
                    </div>
                  </div>
                )}
                {hoveredPage === 'chatbot' && (
                  <div className="space-y-2">
                    <div className="flex gap-2 justify-end">
                      <div className="h-2 bg-accent-green/20 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 bg-accent-green/20 rounded w-2/3"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-dark-surface/95 backdrop-blur-lg border-t border-dark-border shadow-2xl"
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  onMouseEnter={() => setHoveredPage(item.id)}
                  onMouseLeave={() => setHoveredPage(null)}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-accent-teal to-accent-cyan shadow-glow'
                      : 'hover:bg-dark-elevated'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-br from-accent-teal to-accent-cyan rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon and Label */}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        isActive ? 'text-white' : 'text-text-tertiary'
                      }`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors ${
                        isActive ? 'text-white' : 'text-text-tertiary'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Hover Glow Effect */}
                  {!isActive && hoveredPage === item.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-accent-teal/5 rounded-xl"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
