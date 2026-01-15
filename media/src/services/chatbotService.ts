const API_BASE_URL = 'http://localhost:8000';

import { getAuthHeaders } from './authService';

export interface ChatMessage {
  message: string;
  response: string;
}

export interface ConversationMessage {
  id: string;
  message: string;
  response: string;
  role: string;
  created_at: string;
}

/**
 * Send a message to the chatbot and get a response
 */
export async function sendChatMessage(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send message');
    }

    const data: ChatMessage = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

/**
 * Get conversation history
 */
export async function getChatHistory(): Promise<ConversationMessage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch history');
    }

    const data: ConversationMessage[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
}

/**
 * Clear conversation history
 */
export async function clearChatHistory(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to clear history');
    }
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
}
