import { IUseCase } from "@application/interfaces/IUseCase";
import { getAIService } from "@infrastructure/services";
import { ExpenseRepository } from "@infrastructure/repositories/ExpenseRepository";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { parseAmountFromTitle } from "@shared/utils/parseAmountFromTitle";

export interface GenerateWeeklyCheckInRequest {
  userId: string;
}

export interface GenerateWeeklyCheckInResponse {
  question: string;
  weekSummary: string;
  suggestedCommitments?: string[];
}

export class GenerateWeeklyCheckInUseCase
  implements
    IUseCase<GenerateWeeklyCheckInRequest, GenerateWeeklyCheckInResponse>
{
  async execute(
    request: GenerateWeeklyCheckInRequest,
  ): Promise<GenerateWeeklyCheckInResponse> {
    const userRepo = new UserRepository();
    const expenseRepo = new ExpenseRepository();
    const user = await userRepo.findById(request.userId);
    const expenses = await expenseRepo.findByUserId(request.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekExpenses = expenses.filter((e) => {
      const d = e.createdAt ? new Date(e.createdAt) : null;
      return d && d >= oneWeekAgo;
    });

    let totalSpent = 0;
    const categoryTotals: Record<string, number> = {};
    const expenseLines: string[] = [];
    for (const e of weekExpenses) {
      const amount = parseAmountFromTitle(e.title, e.aiDescription);
      totalSpent += amount;
      const cat = inferCategory(e.title);
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
      const d = e.createdAt ? new Date(e.createdAt) : null;
      const dateStr = d ? d.toISOString().slice(0, 10) : "?";
      expenseLines.push(`${dateStr}: ${e.title} ($${amount.toFixed(2)})`);
    }

    const primaryGoal = user.primaryGoalId
      ? user.goalTargets?.[user.primaryGoalId]
      : null;
    const goalsContext = user.financialGoals?.length
      ? `Goals: ${user.financialGoals.join(", ")}. Primary: ${user.primaryGoalId ?? "none"}. Target: $${primaryGoal?.toLocaleString() ?? "?"}`
      : "No goals set yet.";

    const weekSummary =
      weekExpenses.length === 0
        ? "No spending recorded this week."
        : `This week: $${totalSpent.toFixed(2)} spent. Categories: ${Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([c, a]) => `${c} $${a.toFixed(2)}`)
            .join(", ")}. Recent: ${expenseLines.slice(-5).join("; ")}`;

    const prompt = `You are a supportive financial coach. The user just completed a week. Generate a 5-minute weekly check-in.

**User context:**
- Monthly income: $${user.monthlyIncome?.toLocaleString() ?? "?"}
- ${goalsContext}
- Last commitment: ${user.currentCommitment ?? "None"}
- Coach style: ${user.coachPersonality ?? "balanced"}

**This week's spending:**
${weekSummary}

**Your task:**
1. Write a brief 2-3 sentence review of their week (patterns, wins, or gentle observations).
2. Ask ONE powerful, thought-provoking question to help them reflect, e.g. "What's ONE thing you'll do differently this week to stay on track?" or "What emotional trigger led to your biggest splurge this week?"
3. Suggest 2-4 micro-actions they could commit to (e.g. "Pack lunch 3x this week", "Wait 24hrs before any purchase over $50", "No takeout dinners"). Keep each under 10 words.

Return ONLY valid JSON:
{
  "question": "The single powerful question to ask",
  "weekSummary": "Your 2-3 sentence review",
  "suggestedCommitments": ["micro-action 1", "micro-action 2", "micro-action 3"]
}`;

    const aiService = getAIService();
    const content = await aiService.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 800,
    });

    const raw = typeof content === "string" ? content : String(content ?? "");
    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return {
        question: String(parsed.question ?? "What's ONE thing you'll do differently this week to stay on track?"),
        weekSummary: String(parsed.weekSummary ?? weekSummary),
        suggestedCommitments: Array.isArray(parsed.suggestedCommitments)
          ? parsed.suggestedCommitments.map(String).slice(0, 4)
          : undefined,
      };
    } catch {
      return {
        question: "What's ONE thing you'll do differently this week to stay on track?",
        weekSummary,
        suggestedCommitments: [
          "Pack lunch 3x this week",
          "Wait 24hrs before purchases over $50",
          "Track every coffee/snack",
        ],
      };
    }
  }
}

function inferCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("grocery") || t.includes("food") || t.includes("restaurant") || t.includes("cafe")) return "Food";
  if (t.includes("gas") || t.includes("uber") || t.includes("lyft")) return "Transport";
  if (t.includes("amazon") || t.includes("target") || t.includes("walmart")) return "Shopping";
  if (t.includes("netflix") || t.includes("spotify") || t.includes("subscription")) return "Entertainment";
  if (t.includes("rent") || t.includes("utilities")) return "Housing";
  return "Other";
}
