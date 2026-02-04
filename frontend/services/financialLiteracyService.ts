import apiClient from "./axios";

export interface FinancialLiteracyQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GenerateFinancialLiteracyQuestionsResponse {
  questions: FinancialLiteracyQuestion[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export async function generateFinancialLiteracyQuestions(
  topic: string,
  category?: string
): Promise<FinancialLiteracyQuestion[]> {
  const response = await apiClient.post<
    ApiResponse<GenerateFinancialLiteracyQuestionsResponse>
  >("/ai/financial-literacy-questions", {
    topic,
    category,
  });

  if (!response.data.success || !response.data.data?.questions) {
    throw new Error(
      response.data.error?.message || "Failed to generate questions"
    );
  }

  return response.data.data.questions;
}
