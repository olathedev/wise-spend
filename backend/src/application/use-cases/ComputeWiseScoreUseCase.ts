import { IUseCase } from "@application/interfaces/IUseCase";
import { IAIService } from "@domain/interfaces/IAIService";
import { getAIService } from "@infrastructure/services";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { ExpenseRepository } from "@infrastructure/repositories/ExpenseRepository";
import { parseAmountFromTitle } from "@shared/utils/parseAmountFromTitle";

export interface ComputeWiseScoreRequest {
  userId: string;
}

export interface ComputeWiseScoreResponse {
  wiseScore: number;
  wiseScoreTier: string;
  wiseScoreUpdatedAt: Date;
}

export class ComputeWiseScoreUseCase
  implements IUseCase<ComputeWiseScoreRequest, ComputeWiseScoreResponse>
{
  async execute(
    request: ComputeWiseScoreRequest
  ): Promise<ComputeWiseScoreResponse> {
    const userRepo = new UserRepository();
    const expenseRepo = new ExpenseRepository();

    const user = await userRepo.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const expenses = await expenseRepo.findByUserId(request.userId);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlySpending = expenses
      .filter((e) => {
        const d = e.createdAt ? new Date(e.createdAt) : null;
        return d && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + parseAmountFromTitle(e.title, e.aiDescription), 0);

    const income = user.monthlyIncome ?? 0;
    const goals = user.financialGoals ?? [];
    const expenseCount = expenses.length;
    const recentTitles = expenses.slice(0, 10).map((e) => e.title).join("; ");

    const prompt = `You are a financial wellness coach. Given this user snapshot, output a JSON object with exactly two keys: "score" (number 0-1000) and "tier" (short string, e.g. "Top 5%", "Building", "On track", "Needs work").
- Monthly income: $${income}
- Spending this month (from receipts): $${monthlySpending.toFixed(2)}
- Number of tracked expenses: ${expenseCount}
- Goals: ${goals.length ? goals.join(", ") : "none set"}
- Recent expense titles (sample): ${recentTitles || "none"}

Score 0-1000: higher = better budgeting discipline, savings potential, and goal alignment. Be fair: new users with little data should get a mid-range score that can improve. Output only valid JSON, no markdown.`;

    const ai = getAIService();
    const response = await ai.generateText(prompt, {
      temperature: 0.3,
      maxTokens: 256,
    });

    let score = 500;
    let tier = "Building";

    try {
      const trimmed = response.trim().replace(/^```json?\s*|\s*```$/g, "");
      const parsed = JSON.parse(trimmed) as { score?: number; tier?: string };
      if (
        typeof parsed.score === "number" &&
        parsed.score >= 0 &&
        parsed.score <= 1000
      ) {
        score = Math.round(parsed.score);
      }
      if (typeof parsed.tier === "string" && parsed.tier.trim()) {
        tier = parsed.tier.trim().slice(0, 64);
      }
    } catch {
      // keep defaults if AI didn't return valid JSON
    }

    const updatedAt = new Date();
    await userRepo.update(request.userId, {
      wiseScore: score,
      wiseScoreUpdatedAt: updatedAt,
      wiseScoreTier: tier,
    });

    return {
      wiseScore: score,
      wiseScoreTier: tier,
      wiseScoreUpdatedAt: updatedAt,
    };
  }
}
