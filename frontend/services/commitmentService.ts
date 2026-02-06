import apiClient from "./axios";

export interface CommitmentDto {
  id: string;
  weekOf: string;
  commitmentText: string;
  status: "active" | "completed" | "abandoned";
  midWeekCheckInDate?: string;
  midWeekResponse?: string;
  midWeekReminderSentAt?: string;
  aiObservations?: string[];
  completionSelfReport?: string;
  createdAt?: string;
}

export interface GetActiveCommitmentResponse {
  success: boolean;
  data?: CommitmentDto | null;
  daysRemaining?: number;
  error?: { message: string };
}

export interface GetLatestCommitmentResponse {
  success: boolean;
  data?: CommitmentDto | null;
  error?: { message: string };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export async function getActiveCommitment(): Promise<{
  commitment: CommitmentDto | null;
  daysRemaining: number;
}> {
  const response = await apiClient.get<GetActiveCommitmentResponse>("/commitments/active");
  if (!response.data.success) {
    throw new Error(response.data.error?.message || "Failed to get active commitment");
  }
  return {
    commitment: response.data.data ?? null,
    daysRemaining: response.data.daysRemaining ?? 0,
  };
}

export async function getLatestCommitment(): Promise<CommitmentDto | null> {
  const response = await apiClient.get<GetLatestCommitmentResponse>("/commitments/latest");
  if (!response.data.success) {
    throw new Error(response.data.error?.message || "Failed to get latest commitment");
  }
  return response.data.data ?? null;
}

export async function midWeekUpdate(commitmentId: string, midWeekResponse: string): Promise<void> {
  const response = await apiClient.patch<ApiResponse<{ success: boolean }>>(
    `/commitments/${commitmentId}/midweek-update`,
    { midWeekResponse }
  );
  if (!response.data.success) {
    throw new Error(response.data.error?.message || "Failed to save mid-week update");
  }
}

export async function completeCommitment(
  commitmentId: string,
  completionSelfReport: string,
  status?: "completed" | "abandoned"
): Promise<void> {
  const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
    `/commitments/${commitmentId}/complete`,
    { completionSelfReport, status }
  );
  if (!response.data.success) {
    throw new Error(response.data.error?.message || "Failed to complete commitment");
  }
}
