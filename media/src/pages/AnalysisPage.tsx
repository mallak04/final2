import CodeDisplay from '../components/CodeDisplay';
import ErrorAnalysis from '../components/ErrorAnalysis';
import Recommendations from '../components/Recommendations';
import Chatbot from '../components/Chatbot';
import { mockCodeSample, mockErrors, mockRecommendations } from '../data/mockData';

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {codeData && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Analyzing:</span> {fileName} ({codeData.language})
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CodeDisplay code={displayCode} />
        <ErrorAnalysis errors={mockErrors} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Recommendations recommendations={mockRecommendations} />
        <Chatbot />
      </div>
    </div>
  );
}