import { IUseCase } from '@application/interfaces/IUseCase';
import { IAIService, ChatRequest, ChatResponse } from '@domain/interfaces/IAIService';
import { getAIService } from '@infrastructure/services';

export class ChatUseCase implements IUseCase<ChatRequest, ChatResponse> {
  private aiService: IAIService;

  constructor(aiService?: IAIService) {
    this.aiService = aiService || getAIService();
  }

  async execute(request: ChatRequest): Promise<ChatResponse> {
    if (!request.messages || request.messages.length === 0) {
      throw new Error('At least one message is required');
    }

    return await this.aiService.chat(request);
  }
}
