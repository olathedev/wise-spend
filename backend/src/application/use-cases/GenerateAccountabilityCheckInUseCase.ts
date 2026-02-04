import { IUseCase } from "@application/interfaces/IUseCase";
import { getAIService } from "@infrastructure/services";
import { UserRepository } from "@infrastructure/repositories/UserRepository";

export interface GenerateAccountabilityCheckInRequest {
  userId: string;
}

export interface GenerateAccountabilityCheckInResponse {
  question: string;
  encouragement: string;
}

export class GenerateAccountabilityCheckInUseCase
  implements
    IUseCase<
      GenerateAccountabilityCheckInRequest,
      GenerateAccountabilityCheckInResponse
    >
{
  async execute(
    request: GenerateAccountabilityCheckInRequest,
  ): Promise<GenerateAccountabilityCheckInResponse> {
    const userRepo = new UserRepository();
    const user = await userRepo.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const commitment = user.currentCommitment ?? "No commitment set";
    const createdAt = user.commitmentCreatedAt
      ? new Date(user.commitmentCreatedAt)
      : null;
    const daysSince = createdAt
      ? Math.floor(
          (Date.now() - createdAt.getTime()) / (24 * 60 * 60 * 1000)
        )
      : 0;

    const prompt = `You are a supportive financial coach. The user committed to: "${commitment}" about ${daysSince} days ago.

Generate a mid-week accountability check-in that:
1. References their commitment warmly (e.g. "You committed to packing lunch 3x this week - how's it going?")
2. Asks ONE short question to check in (celebrate wins, explore struggles without judgment)
3. Includes 1-2 sentences of encouragement. If they might be struggling, be empathetic - "Life happens. What would help you get back on track?"

Return ONLY valid JSON:
{
  "question": "The check-in question (reference their commitment)",
  "encouragement": "1-2 sentences of support"
}`;

    const aiService = getAIService();
    const content = await aiService.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 300,
    });

    const raw = typeof content === "string" ? content : String(content ?? "");
    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return {
        question: String(
          parsed.question ??
            `You committed to "${commitment}" - how's it going?`
        ),
        encouragement: String(
          parsed.encouragement ??
            "Every small step counts. Keep going!"
        ),
      };
    } catch {
      return {
        question: `You committed to "${commitment}" - how's it going?`,
        encouragement: "Every small step counts. Keep going!",
      };
    }
  }
}
