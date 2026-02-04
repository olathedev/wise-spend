import { IUseCase } from "@application/interfaces/IUseCase";
import { getAIService } from "@infrastructure/services";
import { ExpenseRepository } from "@infrastructure/repositories/ExpenseRepository";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { parseAmountFromTitle } from "@shared/utils/parseAmountFromTitle";

export interface GenerateFinancialLiteracyQuestionsRequest {
  userId: string;
  topic: string;
  category?: string;
}

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

function buildSpendingContext(
  expenses: { title: string; aiDescription?: string; createdAt?: Date }[],
  monthlyIncome?: number,
): string {
  if (!expenses || expenses.length === 0) {
    return "The user has no recorded expenses yet. Generate general educational questions about the topic that would help someone getting started with their finances.";
  }

  const recent = expenses.slice(0, 30);
  const expenseLines = recent.map((e) => {
    const d = e.createdAt ? new Date(e.createdAt) : null;
    const dateStr = d ? d.toISOString().slice(0, 10) : "?";
    const amount = parseAmountFromTitle(e.title, e.aiDescription);
    const amountStr = amount > 0 ? ` ($${amount.toFixed(2)})` : "";
    return `- ${dateStr}: ${e.title}${amountStr}`;
  });

  let totalSpent = 0;
  const categoryTotals: Record<string, number> = {};
  for (const e of recent) {
    const amount = parseAmountFromTitle(e.title, e.aiDescription);
    totalSpent += amount;
    const category = inferCategory(e.title);
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  }

  const categorySummary = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
    .join(", ");

  let context = `Recent expenses (last 30):
${expenseLines.join("\n")}

Total recent spending: $${totalSpent.toFixed(2)}
Spending by category: ${categorySummary}`;

  if (monthlyIncome && monthlyIncome > 0) {
    const savingsRate =
      totalSpent > 0
        ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100
        : null;
    context += `\nUser's approximate monthly income: $${monthlyIncome.toFixed(2)}`;
    if (savingsRate !== null) {
      context += `\nApproximate savings rate from recent data: ${savingsRate.toFixed(1)}%`;
    }
  }

  return context;
}

function inferCategory(title: string): string {
  const t = title.toLowerCase();
  if (
    t.includes("grocery") ||
    t.includes("supermarket") ||
    t.includes("food") ||
    t.includes("restaurant") ||
    t.includes("cafe") ||
    t.includes("coffee")
  )
    return "Food";
  if (
    t.includes("gas") ||
    t.includes("fuel") ||
    t.includes("uber") ||
    t.includes("lyft") ||
    t.includes("parking")
  )
    return "Transport";
  if (
    t.includes("amazon") ||
    t.includes("target") ||
    t.includes("walmart") ||
    t.includes("store")
  )
    return "Shopping";
  if (
    t.includes("netflix") ||
    t.includes("spotify") ||
    t.includes("subscription") ||
    t.includes("streaming")
  )
    return "Entertainment";
  if (t.includes("rent") || t.includes("utilities") || t.includes("electric"))
    return "Housing";
  return "Other";
}

function buildPrompt(
  topic: string,
  category: string | undefined,
  spendingContext: string,
): string {
  return `You are a friendly financial literacy educator. Generate personalized financial literacy quiz questions for the topic "${topic}"${category ? ` (category: ${category})` : ""}.

IMPORTANT: Use the user's actual spending data below to personalize SOME questions. For example:
- If they spend a lot on food/dining, ask a question about how their food spending fits the 50/30/20 rule
- If they have subscription expenses, ask about the "latte factor" or recurring expenses
- If they have high total spending, ask about emergency fund size based on their expense level
- Use their real numbers (amounts, categories) when relevant to make questions feel personal
- Not every question needs to be personalized—include a mix of general concepts and personalized ones

User spending context:
${spendingContext}

Generate exactly 10 quiz questions. Each question must have:
- question: clear, educational question (can reference their spending when relevant)
- options: array of exactly 4 answer choices (strings)
- correctAnswer: 0-based index of the correct option (0, 1, 2, or 3)
- explanation: 1-3 sentences explaining the answer, optionally tying it to their situation

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation text here."
  },
  ...
]

Make questions educational, practical, and helpful for building financial literacy. Ensure correctAnswer is always 0, 1, 2, or 3.`;
}

export class GenerateFinancialLiteracyQuestionsUseCase
  implements
    IUseCase<
      GenerateFinancialLiteracyQuestionsRequest,
      GenerateFinancialLiteracyQuestionsResponse
    >
{
  async execute(
    request: GenerateFinancialLiteracyQuestionsRequest,
  ): Promise<GenerateFinancialLiteracyQuestionsResponse> {
    const expenseRepo = new ExpenseRepository();
    const userRepo = new UserRepository();
    const expenses = await expenseRepo.findByUserId(request.userId);
    const user = await userRepo.findById(request.userId);

    const spendingContext = buildSpendingContext(
      expenses,
      user?.monthlyIncome ?? undefined,
    );
    const prompt = buildPrompt(
      request.topic,
      request.category,
      spendingContext,
    );

    const aiService = getAIService();
    const content = await aiService.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 4000,
    });

    const rawContent = typeof content === "string" ? content : String(content ?? "");

    try {
      let jsonStr = rawContent.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }

      const parsed = JSON.parse(jsonStr);
      const arr = Array.isArray(parsed) ? parsed : [];

      const questions: FinancialLiteracyQuestion[] = arr
        .slice(0, 10)
        .map((item: Record<string, unknown>, index: number) => {
          const opts = Array.isArray(item.options) ? item.options : [];
          const options = opts.map(String).filter(Boolean);
          if (options.length < 2) return null;

          const correctAnswer = Math.min(
            Math.max(0, Number(item.correctAnswer) || 0),
            options.length - 1,
          );

          return {
            id: index + 1,
            question: String(item.question || `Question ${index + 1}`).trim(),
            options,
            correctAnswer,
            explanation: String(
              item.explanation || "Learn more about this topic to understand the answer.",
            ).trim(),
          };
        })
        .filter((q): q is FinancialLiteracyQuestion => q !== null);

      if (questions.length === 0) {
        throw new Error("No valid questions generated");
      }

      return { questions };
    } catch (error) {
      console.error(
        "Failed to parse AI financial literacy response:",
        error,
      );
      throw new Error("Failed to generate personalized questions. Please try again.");
    }
  }
}
