import apiClient from "./axios";

export interface WeeklyCheckInResponse {
  question: string;
  weekSummary: string;
  suggestedCommitments?: string[];
}

export interface AccountabilityCheckInResponse {
  question: string;
  encouragement: string;
}

export interface MilestoneCheckResponse {
  shouldCelebrate: boolean;
  milestoneAmount: number;
  message: string;
  monthsCloser?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export async function generateWeeklyCheckIn(): Promise<WeeklyCheckInResponse> {
  const response = await apiClient.post<ApiResponse<WeeklyCheckInResponse>>(
    "/ai/weekly-check-in"
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to generate weekly check-in"
    );
  }
  return response.data.data;
}

export async function saveCommitment(commitment: string): Promise<void> {
  const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
    "/ai/commitment",
    { commitment }
  );
  if (!response.data.success) {
    throw new Error(
      response.data.error?.message || "Failed to save commitment"
    );
  }
}

export async function generateAccountabilityCheckIn(): Promise<AccountabilityCheckInResponse> {
  const response = await apiClient.post<
    ApiResponse<AccountabilityCheckInResponse>
  >("/ai/accountability-check-in");
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to generate accountability check-in"
    );
  }
  return response.data.data;
}

export async function checkMilestoneCelebration(
  currentSavedAmount: number
): Promise<MilestoneCheckResponse> {
  const response = await apiClient.post<ApiResponse<MilestoneCheckResponse>>(
    "/ai/milestone/check",
    { currentSavedAmount }
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to check milestone"
    );
  }
  return response.data.data;
}
