export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface IAIService {
  chat(request: ChatRequest): Promise<ChatResponse>;
  generateText(prompt: string, options?: Partial<ChatRequest>): Promise<string>;
}
