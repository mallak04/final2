import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Lightbulb, CheckSquare, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { mockCodeSample, mockCorrectedCode, mockErrors, mockRecommendations } from '../data/mockData';
import { analyzeCode } from '../services/apiService';

interface CodeData {
  code: string;
  language: string;
  fileName: string;
}

interface AnalysisPageProps {
  codeData: CodeData | null;
}

// Helper function to apply underlining to corrected parts
function applyUnderlining(code: string, corrections: string[]): string {
  let highlightedCode = code;

  corrections.forEach(correction => {
    // Escape special regex characters
    const escapedCorrection = correction.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Apply underline styling
    highlightedCode = highlightedCode.replace(
      new RegExp(escapedCorrection, 'g'),
      `<u class="decoration-accent-green decoration-2 decoration-wavy">${correction}</u>`
    );
  });

  return highlightedCode;
}

export default function AnalysisPage({ codeData }: AnalysisPageProps) {
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // State for AI analysis data
  const [aiCorrections, setAiCorrections] = useState<string[] | null>(null);
  const [correctedCodeFromAI, setCorrectedCodeFromAI] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filter errors that have a count > 0 for display
  const errorsToDisplay = mockErrors.filter(error => error.count > 0);
  
  // Calculate total errors based *only* on the ones we will display
  const totalErrors = errorsToDisplay.reduce((sum, error) => sum + error.count, 0);

  // Fetch AI analysis when code is available
  useEffect(() => {
    if (codeData?.code) {
      setIsAnalyzing(true);
      analyzeCode(codeData.code, codeData.language)
        .then((result) => {
          // Backend should return: { correctedCode: string, corrections: string[] }
          setCorrectedCodeFromAI(result.correctedCode || null);
          setAiCorrections(result.corrections || null);
        })
        .catch((error) => {
          console.error('Failed to analyze code:', error);
          // Fall back to displaying original code without AI analysis
          setCorrectedCodeFromAI(null);
          setAiCorrections(null);
        })
        .finally(() => {
          setIsAnalyzing(false);
        });
    }
  }, [codeData]);

  const toggleError = (category: string) => {
    const newExpanded = new Set(expandedErrors);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedErrors(newExpanded);
  };

  const handleCopy = () => {
    // Use the corrected code as the source for copying
    const codeToCopy = correctedCodeFromAI || codeData?.code || mockCorrectedCode;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Use real code if available, otherwise fall back to mock data
  const displayCode = codeData?.code || mockCodeSample;
  const fileName = codeData?.fileName || 'Sample Code';

  // Determine which corrected code to display (priority: AI > real code > mock)
  const correctedCode = correctedCodeFromAI || codeData?.code || mockCorrectedCode;

  // Determine which corrections to apply for underlining
  const correctionsToApply = aiCorrections || null;


  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-24 px-4 pt-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header with stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-6">Code Analysis</h1>

          {/* Current File Info */}
          {codeData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-accent-green/10 border border-accent-green/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-green" />
                <p className="text-sm text-gray-900 dark:text-text-primary">
                  <span className="font-semibold">✓ Loaded:</span> {codeData.fileName} ({codeData.language}) - {codeData.code.length} characters
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Corrected Code - Full Width */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-lg mb-6 hover:border-accent-green transition-all"
        >
          <div className="bg-accent-green px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Corrected Code</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Copy</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="p-6">
            <div className="bg-dark-elevated dark:bg-dark-elevated bg-light-elevated border border-accent-green/30 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-900 dark:text-text-primary leading-relaxed" style={{ fontFamily: 'Consolas, "Courier New", monospace' }}>
                {correctionsToApply ? (
                  // Apply AI corrections with underlining
                  <code dangerouslySetInnerHTML={{ __html: applyUnderlining(correctedCode, correctionsToApply) }} />
                ) : codeData ? (
                  // Show real code without underlining (AI hasn't responded yet or no corrections)
                  correctedCode
                ) : (
                  // Show mock corrected code with hardcoded highlights as fallback
                  <code dangerouslySetInnerHTML={{ __html: mockCorrectedCode.replace(/let total = 0;/g, '<u class="decoration-accent-green decoration-2 decoration-wavy">let total = 0;</u>').replace(/for \(let i = 0; i < items\.length; i\+\+\)/g, '<u class="decoration-accent-green decoration-2 decoration-wavy">for (let i = 0; i < items.length; i++)</u>').replace(/if \(items\[i\]\.price > 0\)/g, '<u class="decoration-accent-green decoration-2 decoration-wavy">if (items[i].price > 0)</u>').replace(/return total;/g, '<u class="decoration-accent-green decoration-2 decoration-wavy">return total;</u>').replace(/const myArray = \[1, 2, 3\];/g, '<u class="decoration-accent-green decoration-2 decoration-wavy">const myArray = [1, 2, 3];</u>').replace(/name: "John",/g, '<u class="decoration-accent-green decoration-2 decoration-wavy">name: "John",</u>') }} />
                )}
              </pre>
            </div>
            <p className="text-gray-600 dark:text-text-secondary text-sm mt-3">
              <u className="decoration-accent-green decoration-2 decoration-wavy">Underlined parts</u> indicate corrections made to fix the errors in your code.
            </p>
          </div>
        </motion.div>

        {/* Error Analysis - Full Width */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-lg mb-6 hover:border-accent-teal transition-all"
        >
          <div className="bg-accent-teal px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/analysis.svg" alt="Analysis" className="w-5 h-5" />
              <h2 className="text-lg font-semibold text-white">Error Analysis</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white font-semibold text-sm">{totalErrors} issues</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* === START OF MODIFIED LOGIC: Filtering only errors with count > 0 === */}
              {errorsToDisplay.map((error, index) => (
                <motion.div
                  key={error.category}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer 
                    bg-red-500/5 border-red-500/30 hover:border-red-500/50`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 
                          bg-red-500/10 text-red-400`}
                      >
                        {error.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-1">{error.category}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {error.count}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-text-secondary mb-3">{error.description}</p>
                  {/* The check for error.count > 0 inside the map is now redundant, but kept the details check */}
                  {(error as any).details && (error as any).details.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-light-border dark:border-dark-border space-y-3">
                      {(error as any).details.map((detail: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                          <button
                            onClick={() => toggleError(`${error.category}-${idx}`)}
                            className="w-full flex items-start gap-2 text-left hover:bg-light-elevated dark:hover:bg-dark-elevated/50 p-2 rounded-lg transition-colors"
                          >
                            {expandedErrors.has(`${error.category}-${idx}`) ? (
                              <ChevronDown className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-xs text-gray-600 dark:text-text-secondary leading-relaxed">
                                <span className="font-semibold text-gray-900 dark:text-text-primary">Line {detail.line}:</span> {detail.message}
                              </p>
                            </div>
                          </button>

                          {expandedErrors.has(`${error.category}-${idx}`) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-6 space-y-3 overflow-hidden"
                            >
                              <div className="bg-light-elevated dark:bg-dark-elevated rounded-lg p-3 border border-red-500/20">
                                <p className="text-xs font-semibold text-red-400 mb-2">Error Code Snippet:</p>
                                <pre className="text-xs font-mono text-gray-900 dark:text-text-primary bg-light-bg dark:bg-dark-bg p-2 rounded overflow-x-auto">
                                  {detail.codeSnippet}
                                </pre>
                              </div>

                              <div className="bg-light-elevated dark:bg-dark-elevated rounded-lg p-3 border border-accent-green/20">
                                <p className="text-xs font-semibold text-accent-green mb-2">Correction:</p>
                                <pre className="text-xs font-mono text-gray-900 dark:text-text-primary bg-light-bg dark:bg-dark-bg p-2 rounded overflow-x-auto">
                                  {detail.correction}
                                </pre>
                              </div>

                              <div className="bg-light-elevated dark:bg-dark-elevated rounded-lg p-3 border border-accent-cyan/20">
                                <p className="text-xs font-semibold text-accent-cyan mb-2">Explanation:</p>
                                <p className="text-xs text-gray-600 dark:text-text-secondary leading-relaxed">
                                  {detail.explanation}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {/* === END OF MODIFIED LOGIC === */}

              {/* Display a "No Errors" message if the filtered list is empty */}
              {totalErrors === 0 && (
                <div className="col-span-1 md:col-span-2 p-6 bg-accent-green/10 border-2 border-accent-green/30 rounded-lg flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-accent-green" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                    Great job! No errors were found in your code based on the current analysis categories.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recommendations - Full Width */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
          className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-lg hover:border-accent-green transition-all"
        >
          <div className="bg-accent-cyan px-4 py-3 flex items-center gap-2">
            <div>
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
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
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-accent-green/5 border-2 border-accent-green/20 hover:bg-accent-green/10 hover:border-accent-green/40 transition-all cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-full bg-accent-cyan text-white flex items-center justify-center text-sm font-bold flex-shrink-0"
                  >
                    {index + 1}
                  </div>
                  <p className="text-gray-900 dark:text-text-primary text-sm leading-relaxed">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}