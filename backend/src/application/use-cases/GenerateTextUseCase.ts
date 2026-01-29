import { IUseCase } from '@application/interfaces/IUseCase';
import { IAIService } from '@domain/interfaces/IAIService';
import { getAIService } from '@infrastructure/services';

export interface GenerateTextRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface GenerateTextResponse {
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export class GenerateTextUseCase implements IUseCase<GenerateTextRequest, GenerateTextResponse> {
  private aiService: IAIService;

  constructor(aiService?: IAIService) {
    this.aiService = aiService || getAIService();
  }

  async execute(request: GenerateTextRequest): Promise<GenerateTextResponse> {
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    const response = await this.aiService.chat({
      messages: [{ role: 'user', content: request.prompt }],
      temperature: request.temperature,
      maxTokens: request.maxTokens,
      model: request.model,
    });

    return {
      content: response.content,
      usage: response.usage,
    };
  }
}
