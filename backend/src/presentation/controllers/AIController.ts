import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { GenerateTextUseCase, GenerateTextRequest } from '@application/use-cases/GenerateTextUseCase';
import { ChatUseCase } from '@application/use-cases/ChatUseCase';
import { ComputeWiseScoreUseCase } from '@application/use-cases/ComputeWiseScoreUseCase';
import { ChatRequest } from '@domain/interfaces/IAIService';
import { AuthRequest } from '@presentation/middleware/authMiddleware';
import { UnauthorizedError } from '@shared/errors/AppError';

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

  async computeWiseScore(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized'));
    }
    const useCase = new ComputeWiseScoreUseCase();
    try {
      const result = await useCase.execute({ userId });
      res.status(200).json({
        success: true,
        data: {
          wiseScore: result.wiseScore,
          wiseScoreTier: result.wiseScoreTier,
          wiseScoreUpdatedAt: result.wiseScoreUpdatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
