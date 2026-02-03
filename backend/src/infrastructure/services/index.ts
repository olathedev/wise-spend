import { GoogleGenAIService } from './GoogleGenAIService';
import { IAIService } from '@domain/interfaces/IAIService';

let aiServiceInstance: IAIService | null = null;

export const initializeAIService = (): IAIService => {
  if (aiServiceInstance) {
    return aiServiceInstance;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY or GOOGLE_GENAI_API_KEY environment variable is required'
    );
  }

  aiServiceInstance = new GoogleGenAIService(apiKey, model);
  return aiServiceInstance;
};

export const getAIService = (): IAIService => {
  if (!aiServiceInstance) {
    return initializeAIService();
  }
  return aiServiceInstance;
};

export { IAIService } from '@domain/interfaces/IAIService';
export { OpikService, getOpikService } from './OpikService';
