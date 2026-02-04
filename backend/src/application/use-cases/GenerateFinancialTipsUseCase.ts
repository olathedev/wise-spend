import { IUseCase } from "@application/interfaces/IUseCase";
import { getAIService } from "@infrastructure/services";

export interface GenerateFinancialTipsRequest {
  topic: string;
  category?: string;
}

export interface FinancialTip {
  id: string;
  title: string;
  content: string;
}

export interface GenerateFinancialTipsResponse {
  tips: FinancialTip[];
}

function buildFinancialTipsPrompt(topic: string, category?: string): string {
  return `You are a friendly financial education assistant. Generate 3-5 educational financial tips about "${topic}"${category ? ` (category: ${category})` : ""}.

Each tip should:
- Have a clear, engaging title (max 60 characters)
- Contain practical, actionable content (2-4 paragraphs)
- Use markdown formatting (bold, lists, etc.)
- Be educational and easy to understand
- Include real-world examples when helpful
- Be encouraging and supportive

Return ONLY a JSON array with this exact structure:
[
  {
    "id": "1",
    "title": "Tip Title Here",
    "content": "Markdown formatted content here..."
  },
  {
    "id": "2",
    "title": "Another Tip Title",
    "content": "More markdown content..."
  }
]

Make sure the tips are comprehensive, practical, and help users understand and apply the concept of "${topic}".`;
}

export class GenerateFinancialTipsUseCase
  implements IUseCase<GenerateFinancialTipsRequest, GenerateFinancialTipsResponse>
{
  async execute(
    request: GenerateFinancialTipsRequest,
  ): Promise<GenerateFinancialTipsResponse> {
    const prompt = buildFinancialTipsPrompt(request.topic, request.category);

    const aiService = getAIService();
    const response = await aiService.generateText({
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Parse JSON response from AI
    try {
      // Try to extract JSON from the response (AI might wrap it in markdown code blocks)
      let jsonStr = response.content.trim();
      
      // Remove markdown code blocks if present
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }

      const tips: FinancialTip[] = JSON.parse(jsonStr);

      // Validate and ensure we have valid tips
      if (!Array.isArray(tips) || tips.length === 0) {
        throw new Error("Invalid tips format");
      }

      // Ensure each tip has required fields
      const validTips = tips
        .filter((tip) => tip.id && tip.title && tip.content)
        .map((tip, index) => ({
          id: tip.id || String(index + 1),
          title: tip.title || `Tip ${index + 1}`,
          content: tip.content || "",
        }));

      if (validTips.length === 0) {
        throw new Error("No valid tips generated");
      }

      return { tips: validTips };
    } catch (error) {
      // If parsing fails, return structured tips from the raw response
      console.error("Failed to parse AI response as JSON:", error);
      
      // Fallback: create tips from the raw text
      const paragraphs = response.content
        .split(/\n\n+/)
        .filter((p) => p.trim().length > 50);

      if (paragraphs.length === 0) {
        throw new Error("Failed to generate financial tips");
      }

      // Create tips from paragraphs (group into 3-5 tips)
      const tipsPerGroup = Math.ceil(paragraphs.length / 4);
      const tips: FinancialTip[] = [];

      for (let i = 0; i < paragraphs.length; i += tipsPerGroup) {
        const group = paragraphs.slice(i, i + tipsPerGroup);
        const titleMatch = group[0].match(/^#+\s*(.+)$/m) || group[0].match(/^\*\*(.+?)\*\*/);
        const title = titleMatch
          ? titleMatch[1].trim()
          : `${request.topic} - Tip ${tips.length + 1}`;
        const content = group.join("\n\n");

        tips.push({
          id: String(tips.length + 1),
          title: title.substring(0, 60),
          content,
        });

        if (tips.length >= 5) break;
      }

      return { tips: tips.slice(0, 5) };
    }
  }
}
