import { IUseCase } from "@application/interfaces/IUseCase";
import { getAIService } from "@infrastructure/services";

export interface Goal {
  id: string;
  name: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  aiStatus: string;
}

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

export interface GenerateSocraticGoalSuggestionRequest {
  goals: Goal[];
  sacrificeOptions: SacrificeOption[];
  monthlyIncome: number | null;
}

export interface GenerateSocraticGoalSuggestionResponse {
  suggestion: string;
}

function buildSocraticPrompt(
  goals: Goal[],
  sacrificeOptions: SacrificeOption[],
  monthlyIncome: number | null
): string {
  const goalsWithTargets = goals.filter((g) => g.targetAmount > 0);
  const goalsSummary = goalsWithTargets
    .map(
      (g) =>
        `- ${g.name}: $${g.currentAmount.toLocaleString()} / $${g.targetAmount.toLocaleString()} (${Math.round((g.currentAmount / g.targetAmount) * 100)}% complete)`
    )
    .join("\n");

  const topSacrifice =
    sacrificeOptions.length > 0 ? sacrificeOptions[0] : null;
  const sacrificeSummary = topSacrifice
    ? `Top opportunity: Skipping ${topSacrifice.name} (saves ~$${Math.round(topSacrifice.monthlyAmount).toLocaleString()}/month) could accelerate goals by ${Math.max(...topSacrifice.impact.map((i) => i.monthsSaved))} months.`
    : "No significant sacrifice opportunities identified yet.";

  const incomeContext = monthlyIncome
    ? `Their monthly income is $${monthlyIncome.toLocaleString()}.`
    : "Their monthly income is not set.";

  return `You are a Socratic financial coach. The user has the following financial goals:

${goalsSummary || "No goals with targets set yet."}

${incomeContext}

${sacrificeSummary}

Generate ONE short, thought-provoking question (max 2 sentences) that:
1. Uses the sacrifice score data if available (e.g., "If you skip your daily coffee run, you'd reach your [goal] goal 3 months earlier - is that trade-off worth it to you?")
2. Encourages self-reflection rather than giving direct advice
3. Is conversational and supportive, not preachy
4. Focuses on the top opportunity if sacrifice options are available
5. If no sacrifice options, ask about their priorities or what they're willing to adjust

Write ONLY the question, no preamble or explanation. Make it feel like a genuine conversation starter.`;
}

export class GenerateSocraticGoalSuggestionUseCase
  implements
    IUseCase<
      GenerateSocraticGoalSuggestionRequest,
      GenerateSocraticGoalSuggestionResponse
    >
{
  async execute(
    request: GenerateSocraticGoalSuggestionRequest,
  ): Promise<GenerateSocraticGoalSuggestionResponse> {
    const prompt = buildSocraticPrompt(
      request.goals,
      request.sacrificeOptions,
      request.monthlyIncome,
    );

    const aiService = getAIService();
    const response = await aiService.generateText({
      prompt,
      temperature: 0.7,
      maxTokens: 150,
    });

    return {
      suggestion: response.content.trim(),
    };
  }
}
