import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { GenerateTextUseCase, GenerateTextRequest } from '@application/use-cases/GenerateTextUseCase';
import { ChatUseCase } from '@application/use-cases/ChatUseCase';
import { ChatRequest } from '@domain/interfaces/IAIService';

export class AIController extends BaseController {
  async generateText(req: Request, res: Response, next: NextFunction): Promise<void> {
    const request: GenerateTextRequest = {
      prompt: req.body.prompt,
      temperature: req.body.temperature,
      maxTokens: req.body.maxTokens,
      model: req.body.model,
    };

    const useCase = new GenerateTextUseCase();
    await this.executeUseCase(useCase, request, res, next);
  }

  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    const request: ChatRequest = {
      messages: req.body.messages,
      temperature: req.body.temperature,
      maxTokens: req.body.maxTokens,
      model: req.body.model,
    };

    const useCase = new ChatUseCase();
    await this.executeUseCase(useCase, request, res, next);
  }
}
