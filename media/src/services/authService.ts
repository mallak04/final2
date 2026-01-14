const API_BASE_URL = 'http://localhost:8000';

/**
 * Parses API error responses to return a human-readable string.
 * Handles FastAPI validation errors which are arrays of objects.
 * @param error The error object from a failed API call.
 * @returns A string representing the error message.
 */
function parseApiError(error: any): string {
  // Handle FastAPI validation errors (e.g., invalid email)
  if (Array.isArray(error.detail)) {
    try {
      // Extract the message from the first validation error object
      return error.detail[0].msg || 'Invalid input provided.';
    } catch {
      return 'Could not parse validation error.';
    }
  }
  // Handle standard string detail errors
  if (typeof error.detail === 'string') {
    return error.detail;
  }
  return 'An unknown error occurred.';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    email: string;
    full_name?: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
}

// Token storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Store authentication token and user data
 */
export function setAuthToken(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored user data
 */
export function getAuthUser(): User | null {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Login user
 */
export async function login(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseApiError(error) || 'Login failed');
    }

    const data = await response.json();

    // Store token and user data
    setAuthToken(data.access_token, data.user);

    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

/**
 * Register new user
 */
export async function register(data: RegisterRequest): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseApiError(error) || 'Registration failed');
    }

    const newUser: User = await response.json();
    return newUser;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}

/**
 * Logout user
 */
export function logout(): void {
  clearAuth();
}

/**
 * Get current user profile from API
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        clearAuth();
        throw new Error('Session expired. Please login again.');
      }
      const error = await response.json();
      throw new Error(parseApiError(error) || 'Failed to fetch user data');
    }

    const user = await response.json();

    // Update stored user data
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
}

/**
 * Get authorization headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`,
  };
}
