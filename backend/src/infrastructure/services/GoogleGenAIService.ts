import { GoogleGenAI } from '@google/genai';
import {
  IAIService,
  ChatRequest,
  ChatResponse,
  ChatMessage,
  AnalyzeWithImageRequest,
} from '@domain/interfaces/IAIService';
import { Logger } from '@shared/utils/logger';
import { getOpikService } from './OpikService';

export class GoogleGenAIService implements IAIService {
  private genAI: GoogleGenAI;
  private defaultModel: string;
  private opikService = getOpikService();

  constructor(apiKey: string, defaultModel: string = 'gemini-2.5-flash') {
    if (!apiKey) {
      throw new Error('Google GenAI API key is required');
    }
    this.genAI = new GoogleGenAI({ apiKey });
    this.defaultModel = defaultModel;
    Logger.info('Google GenAI service initialized', { model: defaultModel });
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const model = request.model || this.defaultModel;
    const traceName = `chat-${model}`;
    
    // Create Opik trace for agent reasoning chain
    const trace = this.opikService.createTrace(traceName, {
      model,
      temperature: request.temperature ?? 0.7,
      maxTokens: request.maxTokens ?? 2048,
      messageCount: request.messages.length,
      messages: request.messages.map((msg) => ({
        role: msg.role,
        contentPreview: msg.content.substring(0, 100),
      })),
    }, {
      operation: 'chat',
      provider: 'google-genai',
    });

    try {
      // Convert messages to content format
      const contents = this.formatMessagesToContent(request.messages);

      // Create span for LLM call
      const llmSpan = trace.span({
        name: 'gemini-generate-content',
        type: 'llm',
        input: {
          model,
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens ?? 2048,
          prompt: request.messages[request.messages.length - 1]?.content || '',
        },
        metadata: {
          provider: 'google-genai',
          model,
        },
      });

      const response = await this.genAI.models.generateContent({
        model,
        contents,
        config: {
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens ?? 2048,
        },
      });

      const text = response.text || '';

      // Update span with response
      llmSpan.update({
        output: {
          response: text.substring(0, 500), // Preview for Opik
          fullResponse: text,
        },
        metadata: {
          usage: {
            totalTokens: response.usageMetadata?.totalTokenCount,
            promptTokens: response.usageMetadata?.promptTokenCount,
            completionTokens: response.usageMetadata?.candidatesTokenCount,
          },
        },
      });
      llmSpan.end();

      const result = {
        content: text,
        usage: {
          totalTokens: response.usageMetadata?.totalTokenCount,
          promptTokens: response.usageMetadata?.promptTokenCount,
          completionTokens: response.usageMetadata?.candidatesTokenCount,
        },
      };

      // Update trace with final output
      trace.update({
        output: {
          response: text.substring(0, 500),
          usage: result.usage,
        },
      });
      trace.end();

      return result;
    } catch (error) {
      Logger.error('Error in Google GenAI chat', error);
      
      // Log error to Opik trace
      trace.update({
        output: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        metadata: {
          error: true,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        },
      });
      trace.end();
      
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

  async analyzeWithImage(request: AnalyzeWithImageRequest): Promise<ChatResponse> {
    const model = request.model || this.defaultModel;
    const traceName = 'analyze-receipt-image';
    
    // Create Opik trace for receipt analysis reasoning chain
    // This traces: "Seeing a receipt" → "Calculating goal impact"
    const trace = this.opikService.createTrace(traceName, {
      model,
      prompt: request.prompt,
      imageSize: request.imageBase64.length,
      mimeType: request.mimeType,
      temperature: request.temperature ?? 0.4,
      maxTokens: request.maxTokens ?? 4096,
    }, {
      operation: 'analyze-with-image',
      provider: 'google-genai',
      useCase: 'receipt-analysis',
    });

    try {
      // Span 1: Image preprocessing
      const preprocessSpan = trace.span({
        name: 'preprocess-receipt-image',
        type: 'general',
        input: {
          imageSize: request.imageBase64.length,
          mimeType: request.mimeType,
        },
      });
      preprocessSpan.end();

      const contents = [
        {
          role: 'user' as const,
          parts: [
            {
              inlineData: {
                data: request.imageBase64,
                mimeType: request.mimeType,
              },
            },
            { text: request.prompt },
          ],
        },
      ];

      // Span 2: LLM multimodal analysis
      const llmSpan = trace.span({
        name: 'gemini-multimodal-analysis',
        type: 'llm',
        input: {
          model,
          prompt: request.prompt,
          hasImage: true,
          temperature: request.temperature ?? 0.4,
          maxOutputTokens: request.maxTokens ?? 4096,
        },
        metadata: {
          provider: 'google-genai',
          model,
          multimodal: true,
        },
      });

      const response = await this.genAI.models.generateContent({
        model,
        contents,
        config: {
          temperature: request.temperature ?? 0.4,
          maxOutputTokens: request.maxTokens ?? 4096,
        },
      });

      const text = response.text || '';

      // Update LLM span with response
      llmSpan.update({
        output: {
          analysis: text.substring(0, 500),
          fullAnalysis: text,
        },
        metadata: {
          usage: {
            totalTokens: response.usageMetadata?.totalTokenCount,
            promptTokens: response.usageMetadata?.promptTokenCount,
            completionTokens: response.usageMetadata?.candidatesTokenCount,
          },
        },
      });
      llmSpan.end();

      // Span 3: Post-processing (goal impact calculation would happen here)
      const postprocessSpan = trace.span({
        name: 'calculate-goal-impact',
        type: 'general',
        input: {
          analysis: text.substring(0, 200),
        },
      });
      postprocessSpan.end();

      const result = {
        content: text,
        usage: {
          totalTokens: response.usageMetadata?.totalTokenCount,
          promptTokens: response.usageMetadata?.promptTokenCount,
          completionTokens: response.usageMetadata?.candidatesTokenCount,
        },
      };

      // Update trace with final output
      trace.update({
        output: {
          analysis: text.substring(0, 500),
          usage: result.usage,
        },
      });
      trace.end();

      return result;
    } catch (error) {
      Logger.error('Google GenAI analyzeWithImage failed', error);
      
      // Log error to Opik trace
      trace.update({
        output: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        metadata: {
          error: true,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        },
      });
      trace.end();
      
      throw error;
    }
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
