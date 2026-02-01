import { IUseCase } from "@application/interfaces/IUseCase";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { getAIService } from "@infrastructure/services";
import { NotFoundError } from "@shared/errors/AppError";

export interface AnalyzeReceiptRequest {
  userId: string;
  imageBase64: string;
  mimeType: string;
}

export interface AnalyzeReceiptResponse {
  analysis: string;
}

function buildReceiptAnalysisPrompt(userContext: {
  monthlyIncome: number | null;
  financialGoals: string[] | null;
  coachPersonality: string | null;
}): string {
  const incomeStr =
    userContext.monthlyIncome != null
      ? `Their approximate monthly net income is $${userContext.monthlyIncome}.`
      : "Their monthly income is not provided.";
  const goalsStr =
    userContext.financialGoals?.length &&
    Array.isArray(userContext.financialGoals)
      ? `Their financial goals include: ${userContext.financialGoals.join(", ")}.`
      : "They have not specified financial goals yet.";
  const coachStr =
    userContext.coachPersonality || "They have not chosen a coach style.";

  return `You are a friendly, insightful financial coach. The user has shared a receipt image.

**User context:**
- ${incomeStr}
- ${goalsStr}
- Coach style: ${coachStr}

**Your task:**
1. **Extract spending** – From the receipt image, identify the merchant, date (if visible), total amount spent, and main categories of items (e.g. groceries, dining, retail).
2. **Match against income** – Compare this purchase to their monthly income. What percentage of monthly income does this represent? Is it a one-off or recurring type of expense?
3. **Match against goals** – How does this spending move them toward or away from their stated financial goals? Be specific (e.g. "This $X dinner is Y% of what you could put toward [goal] per month").
4. **Verdict** – Say clearly if this spending is **balanced** (reasonable, aligned with goals), **moderate** (acceptable but with a nudge to optimize), or **excessive** (hurts goals; suggest what would have been better).
5. **Suggestions** – If it's not balanced, suggest 1–3 concrete alternatives (e.g. "A similar meal at home could cost $Z" or "Putting this amount toward [goal] would get you there N months sooner"). If it is balanced, briefly affirm why it fits their situation.
6. **Summary** – End with one short, motivating sentence.

Write in clear paragraphs. Be supportive but honest. Use their income and goals to make the analysis personal and actionable. Do not invent numbers for the receipt; only use what you can read from the image. If you cannot read the receipt clearly, say so and ask them to upload a clearer image.`;
}

export class AnalyzeReceiptUseCase
  implements IUseCase<AnalyzeReceiptRequest, AnalyzeReceiptResponse>
{
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async execute(
    request: AnalyzeReceiptRequest,
  ): Promise<AnalyzeReceiptResponse> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const prompt = buildReceiptAnalysisPrompt({
      monthlyIncome: user.monthlyIncome ?? null,
      financialGoals: user.financialGoals ?? null,
      coachPersonality: user.coachPersonality ?? null,
    });

    const aiService = getAIService();
    const response = await aiService.analyzeWithImage({
      imageBase64: request.imageBase64,
      mimeType: request.mimeType,
      prompt,
      temperature: 0.5,
      maxTokens: 2048,
    });

    return { analysis: response.content };
  }
}
