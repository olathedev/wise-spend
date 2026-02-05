import { IUseCase } from '@application/interfaces/IUseCase';
import { IAIService, ChatRequest, ChatResponse, ChatMessage } from '@domain/interfaces/IAIService';
import { getAIService } from '@infrastructure/services';
import { FinancialAssistantAgent } from '@infrastructure/services/FinancialAssistantAgent';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { ExpenseRepository } from '@infrastructure/repositories/ExpenseRepository';
import { getOpikService } from '@infrastructure/services/OpikService';
import { Logger } from '@shared/utils/logger';
import { NotFoundError } from '@shared/errors/AppError';

export interface FinancialAssistantChatRequest {
  userId: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface FinancialAssistantChatResponse extends ChatResponse {
  contextUsed: {
    hasUserData: boolean;
    hasTransactions: boolean;
    expenseCount: number;
  };
}

/**
 * Financial Assistant Chat Use Case
 * Provides personalized Socratic coaching with full user context
 */
export class FinancialAssistantChatUseCase implements IUseCase<FinancialAssistantChatRequest, FinancialAssistantChatResponse> {
  private aiService: IAIService;
  private assistantAgent: FinancialAssistantAgent;
  private opikService = getOpikService();

  constructor(
    aiService?: IAIService,
    assistantAgent?: FinancialAssistantAgent,
  ) {
    this.aiService = aiService || getAIService();
    this.assistantAgent = assistantAgent || new FinancialAssistantAgent(
      new UserRepository(),
      new ExpenseRepository(),
    );
  }

  async execute(request: FinancialAssistantChatRequest): Promise<FinancialAssistantChatResponse> {
    const { userId, messages, temperature, maxTokens, model } = request;

    if (!messages || messages.length === 0) {
      throw new Error('At least one message is required');
    }

    // Create Opik trace for financial assistant conversation
    const trace = this.opikService.createTrace('financial-assistant-chat', {
      userId,
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 100),
    }, {
      operation: 'financial-assistant-chat',
      provider: 'google-genai',
    });

    try {
      // Load user context
      const contextSpan = trace.span({
        name: 'load-user-context',
        type: 'general',
        input: { userId },
      });

      let context;
      let contextUsed = {
        hasUserData: false,
        hasTransactions: false,
        expenseCount: 0,
      };

      try {
        context = await this.assistantAgent.loadUserContext(userId);
        contextUsed = {
          hasUserData: true,
          hasTransactions: context.recentExpenses.length > 0,
          expenseCount: context.recentExpenses.length,
        };
        contextSpan.end();
      } catch (error) {
        Logger.error('Failed to load user context', error);
        contextSpan.end();
        throw new NotFoundError('User not found or unable to load financial data');
      }

      // Build system prompt with context
      const systemPromptSpan = trace.span({
        name: 'build-system-prompt',
        type: 'general',
        input: {
          hasUserData: contextUsed.hasUserData,
          expenseCount: contextUsed.expenseCount,
        },
      });

      const systemPrompt = this.assistantAgent.buildSystemPrompt(context);
      systemPromptSpan.end();

      // Build enriched messages with system prompt
      const enrichedMessages: ChatMessage[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ];

      // Create LLM call span
      const llmSpan = trace.span({
        name: 'gemini-assistant-chat',
        type: 'llm',
        input: {
          model: model || 'gemini-2.5-flash',
          messageCount: enrichedMessages.length,
          userMessage: messages[messages.length - 1]?.content?.substring(0, 200),
          hasContext: contextUsed.hasUserData,
        },
        metadata: {
          provider: 'google-genai',
          model: model || 'gemini-2.5-flash',
          contextUsed,
        },
      });

      // Call AI service
      const chatRequest: ChatRequest = {
        messages: enrichedMessages,
        temperature: temperature ?? 0.7,
        maxTokens: maxTokens ?? 2048,
        model,
      };

      const response = await this.aiService.chat(chatRequest);

      // Update span with response
      llmSpan.update({
        output: {
          response: response.content.substring(0, 500),
          fullResponse: response.content,
        },
        metadata: {
          usage: response.usage,
        },
      });
      llmSpan.end();

      // Update trace with final output
      trace.update({
        output: {
          response: response.content.substring(0, 500),
          contextUsed,
        },
      });
      trace.end();

      return {
        ...response,
        contextUsed,
      };
    } catch (error) {
      Logger.error('Error in Financial Assistant Chat', error);
      
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
}
