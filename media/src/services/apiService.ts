import { getAuthHeaders } from './authService';

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

export interface UserStats {
  total_analyses: number;
  errors_fixed: number;
  day_streak: number;
}

export interface AnalysisResult {
  correctedCode: string;
  corrections: string[];
  errors?: any[];
  recommendations?: string[];
}

// Fetch progress data for authenticated user
export async function fetchProgressData(): Promise<ProgressData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/progress`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch progress data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return [];
  }
}

// Fetch monthly error breakdown for authenticated user
export async function fetchMonthlyErrorBreakdown(): Promise<MonthlyErrorBreakdown[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/breakdown`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch breakdown data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching breakdown data:', error);
    return [];
  }
}

// Fetch analysis history for authenticated user
export async function fetchAnalysisHistory(limit: number = 10): Promise<HistoryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/history?limit=${limit}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}

// Save a new code analysis (user_id is now set automatically by backend)
export async function saveCodeAnalysis(analysis: Omit<CodeAnalysisCreate, 'user_id'>): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
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

// Get a specific analysis by ID (with ownership verification)
export async function getAnalysis(analysisId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/${analysisId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}

// Fetch user profile statistics for authenticated user
export async function fetchUserStats(): Promise<UserStats | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis/user-stats`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}

// Analyze code with AI (automatically saves for authenticated user)
export async function analyzeCode(code: string, language: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error; // Re-throw to let the component handle the error
  }
}
