import { motion } from 'framer-motion';
import { Code, AlertCircle, CheckCircle, Lightbulb, TrendingUp, Award, Code2 } from 'lucide-react';
import { mockCodeSample, mockErrors, mockRecommendations, mockHistory } from '../data/mockData';
import SecurityAlert from '../components/SecurityAlert';

interface CodeData {
  code: string;
  language: string;
  fileName: string;
}

interface AnalysisPageProps {
  codeData: CodeData | null;
}

export default function AnalysisPage({ codeData }: AnalysisPageProps) {
  // Use real code if available, otherwise fall back to mock data
  const displayCode = codeData?.code || mockCodeSample;
  const fileName = codeData?.fileName || 'Sample Code';

  // Calculate stats
  const totalErrors = mockErrors.reduce((sum, error) => sum + error.count, 0);
  const totalAnalyses = mockHistory.length;
  const totalErrorsHistory = mockHistory.reduce((sum, item) => sum + item.total_errors, 0);
  const avgErrors = (totalErrorsHistory / totalAnalyses).toFixed(1);

  return (
    <div className="min-h-screen bg-dark-bg pb-24 px-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-6">Code Analysis</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-surface border border-dark-border rounded-xl p-5 hover:border-accent-teal transition-all shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-accent-teal" />
                </div>
                <span className="text-3xl font-bold text-text-primary">{totalAnalyses}</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Total Analyses</h3>
              <p className="text-text-secondary text-sm">Code reviews completed</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-surface border border-dark-border rounded-xl p-5 hover:border-accent-cyan transition-all shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-accent-cyan/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-cyan" />
                </div>
                <span className="text-3xl font-bold text-text-primary">{avgErrors}</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Avg Errors</h3>
              <p className="text-text-secondary text-sm">Per analysis session</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-surface border border-dark-border rounded-xl p-5 hover:border-accent-green transition-all shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-accent-green" />
                </div>
                <span className="text-3xl font-bold text-text-primary">
                  {Math.round((1 - totalErrorsHistory / (totalAnalyses * 10)) * 100)}%
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Code Quality</h3>
              <p className="text-text-secondary text-sm">Overall score</p>
            </motion.div>
          </div>

          {/* Current File Info */}
          {codeData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-accent-teal/10 border border-accent-teal/30 rounded-lg"
            >
              <p className="text-sm text-text-primary">
                <span className="font-semibold">Currently Analyzing:</span> {fileName} ({codeData.language})
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Code Display */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-lg"
          >
            <div className="bg-gradient-to-r from-accent-teal to-accent-cyan px-4 py-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Your Code</h2>
            </div>

            <div className="p-6">
              <SecurityAlert />
              <div className="bg-dark-elevated border border-dark-border rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-text-primary leading-relaxed">
                  {displayCode}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Error Analysis */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-lg"
          >
            <div className="bg-gradient-to-r from-accent-teal to-accent-cyan px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">Error Analysis</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white font-semibold text-sm">{totalErrors} issues</span>
              </div>
            </div>

            <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto">
              {mockErrors.map((error, index) => (
                <motion.div
                  key={error.category}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    error.count > 0
                      ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                      : 'bg-accent-green/5 border-accent-green/30 hover:border-accent-green/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                        error.count > 0 ? 'bg-red-500/10 text-red-400' : 'bg-accent-green/10 text-accent-green'
                      }`}>
                        {error.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">{error.category}</h3>
                        <p className="text-sm text-text-secondary">{error.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {error.count > 0 ? (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {error.count}
                        </span>
                      ) : (
                        <CheckCircle className="w-6 h-6 text-accent-green" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommendations - Full Width */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-lg"
        >
          <div className="bg-gradient-to-r from-accent-green to-accent-cyan px-4 py-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRecommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-accent-green/5 border border-accent-green/20 hover:bg-accent-green/10 hover:border-accent-green/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-green to-accent-cyan text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-text-primary text-sm leading-relaxed">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}