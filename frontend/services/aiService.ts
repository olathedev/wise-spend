import apiClient from './axios';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface ChatResponse {
  content: string;
  usage?: {
    totalTokens?: number;
    promptTokens?: number;
    completionTokens?: number;
  };
}

export interface FinancialAssistantChatResponse {
  content: string;
  usage?: {
    totalTokens?: number;
    promptTokens?: number;
    completionTokens?: number;
  };
  contextUsed?: {
    hasUserData: boolean;
    hasTransactions: boolean;
    expenseCount: number;
  };
}

export const chatWithAI = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>('/ai/chat', {
    messages: request.messages,
    temperature: request.temperature ?? 0.7,
    maxTokens: request.maxTokens ?? 2048,
    model: request.model,
  });
  return response.data;
};

/**
 * Chat with Financial Assistant - Personalized Socratic coaching with user context
 * Requires authentication - automatically uses logged-in user's data
 */
export const chatWithFinancialAssistant = async (
  request: ChatRequest
): Promise<FinancialAssistantChatResponse> => {
  console.log('chatWithFinancialAssistant called with:', {
    messageCount: request.messages.length,
    endpoint: '/ai/assistant/chat',
  });

  // Check if auth token exists
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    console.log('Auth token exists:', !!token);
    if (!token) {
      throw new Error('Please log in to use the Financial Assistant.');
    }
  }

  try {
    const requestPayload = {
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      maxTokens: request.maxTokens ?? 2048,
      model: request.model,
    };

    console.log('Making request to /ai/assistant/chat with payload:', requestPayload);
    
    const response = await apiClient.post<{
      success: boolean;
      data?: FinancialAssistantChatResponse;
      error?: {
        message: string;
      };
    }>('/ai/assistant/chat', requestPayload);
    
    console.log('Response received:', response.data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to get response from assistant');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error in chatWithFinancialAssistant:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      request: error.request,
    });
    
    // Handle axios errors
    if (error.response) {
      const errorData = error.response.data;
      throw new Error(errorData?.error?.message || errorData?.message || 'Failed to chat with assistant');
    }
    // Handle network errors
    if (error.request) {
      throw new Error('Network error. Please check your connection.');
    }
    // Re-throw other errors
    throw error;
  }
};
