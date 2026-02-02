import { Goal, SummaryStats } from "../types";

/** Shared list used by onboarding (selection) and goals page (display + add). */
export const GOALS_LIST: { id: string; label: string; description: string }[] = [
  { id: "emergency", label: "Emergency Fund", description: "Safety net for 6 months" },
  { id: "debt", label: "Pay off Debt", description: "Clear high-interest debt" },
  { id: "home", label: "Save for Home", description: "Down payment for a home" },
  { id: "wealth", label: "Build Wealth", description: "Grow your net worth" },
  { id: "travel", label: "Travel & Fun", description: "Trips and experiences" },
  { id: "invest", label: "Start Investing", description: "Grow money in the market" },
  { id: "car", label: "Buy a Car", description: "New or used vehicle" },
  { id: "retirement", label: "Retire Early", description: "Financial independence" },
  { id: "business", label: "Start Business", description: "Fund your venture" },
  { id: "education", label: "Education", description: "Skills and courses" },
  { id: "wedding", label: "Wedding", description: "Your big day" },
  { id: "charity", label: "Charity/Giving", description: "Give back" },
];

/** Map goal id → display info. */
export function goalIdToGoal(id: string): Goal {
  const item = GOALS_LIST.find((g) => g.id === id);
  return {
    id,
    name: item?.label ?? id,
    description: item?.description ?? "Set your target",
    currentAmount: 0,
    targetAmount: 0,
    aiStatus: "Set target",
  };
}

/** Convert user financialGoals (ids) to Goal[] for display. */
export function financialGoalsToGoals(ids: string[] | null | undefined): Goal[] {
  if (!ids || !Array.isArray(ids)) return [];
  return ids.map(goalIdToGoal);
}

/** Placeholder stats when we don't have backend progress yet. */
export function defaultSummaryStats(activeGoalsCount: number): SummaryStats {
  return {
    totalProgress: 0,
    monthlyProgressChange: 0,
    nextMilestone: activeGoalsCount > 0 ? "Set your first target" : "Add a goal",
    milestoneDate: "—",
    monthlyContribution: 0,
    activeGoalsCount,
  };
}
