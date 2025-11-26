import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function SecurityAlert() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 font-semibold text-sm">
              Security Alert: Sensitive information (like passwords or emails) detected.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="ml-4 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-md text-xs font-semibold hover:bg-red-500/30 transition-colors flex-shrink-0"
          >
            Learn more
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-light-surface dark:bg-dark-surface rounded-xl shadow-2xl border border-light-border dark:border-dark-border w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Security Best Practices</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-400 mb-1">Critical Warning</h3>
                      <p className="text-sm text-gray-600 dark:text-text-secondary">
                        Your code contains sensitive information that should never be hardcoded or committed to version control.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg">
                    <div className="w-10 h-10 bg-accent-cyan/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-accent-cyan" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Never Hardcode Credentials</h4>
                      <p className="text-sm text-gray-600 dark:text-text-secondary mb-2">
                        Passwords, API keys, and tokens should never be directly written in your code.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-text-secondary list-disc list-inside space-y-1">
                        <li>Use environment variables instead</li>
                        <li>Store secrets in secure vaults</li>
                        <li>Use configuration management systems</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg">
                    <div className="w-10 h-10 bg-accent-purple/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Protect User Privacy</h4>
                      <p className="text-sm text-gray-600 dark:text-text-secondary mb-2">
                        Personal information like emails and phone numbers need special handling.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-text-secondary list-disc list-inside space-y-1">
                        <li>Encrypt sensitive data at rest</li>
                        <li>Use HTTPS for data transmission</li>
                        <li>Implement proper access controls</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg">
                    <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-accent-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Use .gitignore Properly</h4>
                      <p className="text-sm text-gray-600 dark:text-text-secondary mb-2">
                        Prevent sensitive files from being committed to your repository.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-text-secondary list-disc list-inside space-y-1">
                        <li>Add .env files to .gitignore</li>
                        <li>Never commit config files with secrets</li>
                        <li>Review changes before committing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-accent-teal/5 border border-accent-teal/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Quick Fix Checklist</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-teal font-bold">1.</span>
                      <span>Move all sensitive data to environment variables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-teal font-bold">2.</span>
                      <span>Create a .env.example file with placeholder values</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-teal font-bold">3.</span>
                      <span>Add .env to your .gitignore file</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-teal font-bold">4.</span>
                      <span>Review git history and remove any committed secrets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-teal font-bold">5.</span>
                      <span>Rotate any exposed credentials immediately</span>
                    </li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-accent-teal to-accent-cyan text-white font-semibold rounded-lg hover:shadow-glow transition-shadow"
                >
                  I Understand
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
