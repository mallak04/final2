const API_BASE_URL = 'http://localhost:8000';

export interface ProgressData {
  date: string;
  errors: number;
}

export interface MonthlyErrorBreakdown {
  month: string;
  categories: {
    "Brackets": number;
    "Commas": number;
    "Indentation": number;
    "Case & Spelling": number;
    "Missing/Wrong Colon": number;
    "Other Errors": number;
  };
  total: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  language: string;
  total_errors: number;
  code_preview: string;
}

export interface CodeAnalysisCreate {
  user_id: string;
  code_content: string;
  language: string;
  total_errors: number;
  bracket_errors: number;
  comma_errors: number;
  indentation_errors: number;
  case_spelling_errors: number;
  colon_errors: number;
  other_errors: number;
  recommendations?: string;
}

// Fetch progress data for a user
export async function fetchProgressData(userId: string): Promise<ProgressData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/progress/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch progress data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return [];
  }
}

// Fetch monthly error breakdown
export async function fetchMonthlyErrorBreakdown(userId: string): Promise<MonthlyErrorBreakdown[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/breakdown/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch breakdown data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching breakdown data:', error);
    return [];
  }
}

// Fetch analysis history
export async function fetchAnalysisHistory(userId: string, limit: number = 10): Promise<HistoryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/history/${userId}?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}

// Save a new code analysis
export async function saveCodeAnalysis(analysis: CodeAnalysisCreate): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysis),
    });

    if (!response.ok) {
      throw new Error('Failed to save analysis');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving analysis:', error);
    return null;
  }
}

// Get a specific analysis by ID
export async function getAnalysis(analysisId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/${analysisId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}
