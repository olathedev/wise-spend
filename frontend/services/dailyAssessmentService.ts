import apiClient from "./axios";

export interface DailyAssessmentStatusResponse {
  shouldShow: boolean;
  streak: number;
  totalCompleted: number;
  lastCompletedAt: string | null;
  completedDates: string[];
}

export interface RecordDailyAssessmentResponse {
  success: boolean;
  streak: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export async function getDailyAssessmentStatus(): Promise<DailyAssessmentStatusResponse> {
  const response = await apiClient.get<ApiResponse<DailyAssessmentStatusResponse>>(
    "/ai/daily-assessment/status"
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to get assessment status"
    );
  }
  return response.data.data;
}

export async function recordDailyAssessmentComplete(
  score: number
): Promise<RecordDailyAssessmentResponse> {
  const response = await apiClient.post<ApiResponse<RecordDailyAssessmentResponse>>(
    "/ai/daily-assessment/record",
    { status: "completed", score }
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to record assessment"
    );
  }
  return response.data.data;
}

export async function recordDailyAssessmentSkip(): Promise<RecordDailyAssessmentResponse> {
  const response = await apiClient.post<ApiResponse<RecordDailyAssessmentResponse>>(
    "/ai/daily-assessment/record",
    { status: "skipped" }
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to record skip"
    );
  }
  return response.data.data;
}
