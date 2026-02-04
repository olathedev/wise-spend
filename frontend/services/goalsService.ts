import apiClient from "./axios";
import { Goal } from "@/components/types";

export interface SacrificeOption {
  id: string;
  name: string;
  monthlyAmount: number;
  impact: {
    monthsSaved: number;
    goalId: string;
    goalName: string;
  }[];
}

export interface GenerateSocraticSuggestionRequest {
  goals: Goal[];
  sacrificeOptions: SacrificeOption[];
  monthlyIncome: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export async function generateSocraticSuggestion(
  goals: Goal[],
  sacrificeOptions: SacrificeOption[],
  monthlyIncome: number | null
): Promise<string> {
  try {
    const response = await apiClient.post<
      ApiResponse<{ suggestion: string }>
    >("/ai/goals/socratic-suggestion", {
      goals,
      sacrificeOptions,
      monthlyIncome,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.error?.message || "Failed to generate suggestion"
      );
    }

    return response.data.data.suggestion;
  } catch (error) {
    console.error("Error generating Socratic suggestion:", error);
    // Return fallback suggestion
    return getFallbackSuggestion(goals, sacrificeOptions);
  }
}

function getFallbackSuggestion(
  goals: Goal[],
  sacrificeOptions: SacrificeOption[]
): string {
  if (sacrificeOptions.length === 0) {
    return "Set targets for your goals and add expenses to get personalized suggestions on how to accelerate your progress.";
  }

  const topSacrifice = sacrificeOptions[0];
  const topImpact = topSacrifice.impact.reduce(
    (max, i) => (i.monthsSaved > max.monthsSaved ? i : max),
    topSacrifice.impact[0]
  );

  return `If you skip your ${topSacrifice.name.toLowerCase()} habit (saving ~$${Math.round(topSacrifice.monthlyAmount).toLocaleString()}/month), you'd reach your ${topImpact.goalName} goal ${topImpact.monthsSaved} month${topImpact.monthsSaved !== 1 ? "s" : ""} earlier. Is that trade-off worth it to you?`;
}
