import { GoogleGenAI } from '@google/genai';
import { IAIService, ChatRequest, ChatResponse, ChatMessage } from '@domain/interfaces/IAIService';
import { Logger } from '@shared/utils/logger';

export class GoogleGenAIService implements IAIService {
  private genAI: GoogleGenAI;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel: string = 'gemini-2.5-flash') {
    if (!apiKey) {
      throw new Error('Google GenAI API key is required');
    }
    this.genAI = new GoogleGenAI({ apiKey });
    this.defaultModel = defaultModel;
    Logger.info('Google GenAI service initialized', { model: defaultModel });
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const model = request.model || this.defaultModel;
      
      // Convert messages to content format
      const contents = this.formatMessagesToContent(request.messages);

      const response = await this.genAI.models.generateContent({
        model,
        contents,
        config: {
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens ?? 2048,
        },
      });

      const text = response.text || '';

      return {
        content: text,
        usage: {
          totalTokens: response.usageMetadata?.totalTokenCount,
          promptTokens: response.usageMetadata?.promptTokenCount,
          completionTokens: response.usageMetadata?.candidatesTokenCount,
        },
      };
    } catch (error) {
      Logger.error('Error in Google GenAI chat', error);
      throw error;
    }
  }

  async generateText(prompt: string, options?: Partial<ChatRequest>): Promise<string> {
    const request: ChatRequest = {
      messages: [{ role: 'user', content: prompt }],
      ...options,
    };

    const response = await this.chat(request);
    return response.content;
  }

  private formatMessagesToContent(messages: ChatMessage[]): string | Array<{ role: string; parts: Array<{ text: string }> }> {
    // For simple cases, return the last user message as a string
    // For more complex cases with history, return structured content
    if (messages.length === 1 && messages[0].role === 'user') {
      return messages[0].content;
    }

    return messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
  }
}
