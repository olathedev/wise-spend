import apiClient from './axios';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  concept: string;
  questions: QuizQuestion[];
  isCompleted: boolean;
  completedAt?: string;
  score?: number;
  totalQuestions: number;
  answeredCorrectly?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerateQuizzesResponse {
  success: boolean;
  data: {
    quizzes: Quiz[];
    conceptsIdentified: string[];
    totalGenerated: number;
  };
}

export interface GetQuizzesResponse {
  success: boolean;
  data: {
    quizzes: Quiz[];
    stats: {
      total: number;
      completed: number;
      pending: number;
    };
  };
}

export interface CompleteQuizResponse {
  success: boolean;
  data: {
    quiz: Quiz;
    score: number;
    answeredCorrectly: number;
    totalQuestions: number;
  };
}

/**
 * Generate one personalized quiz (5 questions). Replaces any existing AI quiz.
 */
export const generateQuizzes = async (): Promise<GenerateQuizzesResponse['data']> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Please log in to generate personalized quizzes.');
    }
  }

  try {
    const response = await apiClient.post<GenerateQuizzesResponse>('/quiz/generate', {
      count: 1,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to generate quizzes');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error generating quizzes:', error);
    
    if (error.response) {
      const errorData = error.response.data;
      throw new Error(errorData?.error?.message || errorData?.message || 'Failed to generate quizzes');
    }
    if (error.request) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Get quizzes for the logged-in user
 */
export const getQuizzes = async (options?: {
  completed?: boolean;
  limit?: number;
  offset?: number;
}): Promise<GetQuizzesResponse['data']> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Please log in to view your quizzes.');
    }
  }

  try {
    const params = new URLSearchParams();
    if (options?.completed !== undefined) {
      params.append('completed', options.completed.toString());
    }
    if (options?.limit !== undefined) {
      params.append('limit', options.limit.toString());
    }
    if (options?.offset !== undefined) {
      params.append('offset', options.offset.toString());
    }

    const queryString = params.toString();
    const url = `/quiz${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<GetQuizzesResponse>(url);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to get quizzes');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error getting quizzes:', error);
    
    if (error.response) {
      const errorData = error.response.data;
      throw new Error(errorData?.error?.message || errorData?.message || 'Failed to get quizzes');
    }
    if (error.request) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Delete all quizzes for the logged-in user
 */
export const deleteAllQuizzes = async (): Promise<{ deletedCount: number }> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Please log in to delete quizzes.');
    }
  }

  try {
    const response = await apiClient.delete<{
      success: boolean;
      data: {
        deletedCount: number;
        message: string;
      };
    }>('/quiz/all');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to delete quizzes');
    }

    return {
      deletedCount: response.data.data.deletedCount,
    };
  } catch (error: any) {
    console.error('Error deleting quizzes:', error);
    
    if (error.response) {
      const errorData = error.response.data;
      throw new Error(errorData?.error?.message || errorData?.message || 'Failed to delete quizzes');
    }
    if (error.request) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Complete a quiz and submit answers
 */
export const completeQuiz = async (
  quizId: string,
  answers: number[]
): Promise<CompleteQuizResponse['data']> => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Please log in to complete quizzes.');
    }
  }

  try {
    const response = await apiClient.post<CompleteQuizResponse>(
      `/quiz/${quizId}/complete`,
      { answers }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to complete quiz');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error completing quiz:', error);
    
    if (error.response) {
      const errorData = error.response.data;
      throw new Error(errorData?.error?.message || errorData?.message || 'Failed to complete quiz');
    }
    if (error.request) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};
