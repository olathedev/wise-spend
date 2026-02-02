import apiClient from "./axios";

export interface AnalyzeReceiptResponse {
  analysis: string;
  expenseId?: string;
  title?: string;
  imageUrl?: string;
}

export interface ExpenseDto {
  id: string;
  imageUrl: string;
  title: string;
  aiDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export async function analyzeReceipt(
  imageFile: File,
): Promise<AnalyzeReceiptResponse> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await apiClient.post<ApiResponse<AnalyzeReceiptResponse>>(
    "/ai/receipt/analyze",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to analyze receipt",
    );
  }

  return response.data.data;
}

export async function getExpenses(): Promise<ExpenseDto[]> {
  const response = await apiClient.get<ApiResponse<ExpenseDto[]>>(
    "/ai/expenses",
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to fetch expenses",
    );
  }

  return response.data.data;
}
