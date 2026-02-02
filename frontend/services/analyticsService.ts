import apiClient from "./axios";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export interface AnalyticsSummaryDto {
  currentMonthSpending: number;
  lastMonthSpending: number;
  currentMonthCount: number;
  lastMonthCount: number;
  wiseScore: number | null;
  wiseScoreTier: string | null;
}

export interface HeatmapDayDto {
  day: number;
  amount: number;
  count: number;
}

export interface AnalyticsHeatmapDto {
  year: number;
  month: number;
  daysInMonth: number;
  days: HeatmapDayDto[];
}

export interface AnalyticsBehavioralDto {
  insight: string | null;
  userName: string;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummaryDto> {
  const response = await apiClient.get<ApiResponse<AnalyticsSummaryDto>>(
    "/ai/analytics/summary"
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to fetch analytics summary"
    );
  }
  return response.data.data;
}

export async function getAnalyticsHeatmap(): Promise<AnalyticsHeatmapDto> {
  const response = await apiClient.get<ApiResponse<AnalyticsHeatmapDto>>(
    "/ai/analytics/heatmap"
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to fetch heatmap"
    );
  }
  return response.data.data;
}

export async function getAnalyticsBehavioral(): Promise<AnalyticsBehavioralDto> {
  const response = await apiClient.get<ApiResponse<AnalyticsBehavioralDto>>(
    "/ai/analytics/behavioral"
  );
  if (!response.data.success || response.data.data === undefined) {
    throw new Error(
      response.data.error?.message || "Failed to fetch behavioral insight"
    );
  }
  return response.data.data;
}
