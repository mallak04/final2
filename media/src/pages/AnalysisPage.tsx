import CodeDisplay from '../components/CodeDisplay';
import ErrorAnalysis from '../components/ErrorAnalysis';
import Recommendations from '../components/Recommendations';
import Chatbot from '../components/Chatbot';
import { mockCodeSample, mockErrors, mockRecommendations } from '../data/mockData';

export default function AnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CodeDisplay code={mockCodeSample} />
        <ErrorAnalysis errors={mockErrors} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Recommendations recommendations={mockRecommendations} />
        <Chatbot />
      </div>
    </div>
  );
}
