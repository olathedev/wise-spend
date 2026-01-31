import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { AuthenticateWithGoogleUseCase } from '@application/use-cases/AuthenticateWithGoogleUseCase';
import { CompleteOnboardingUseCase } from '@application/use-cases/CompleteOnboardingUseCase';
import { RefreshTokenUseCase } from '@application/use-cases/RefreshTokenUseCase';
import { AuthRequest } from '@presentation/middleware/authMiddleware';
import { UnauthorizedError } from '@shared/errors/AppError';

export class AuthController extends BaseController {
  async authenticateWithGoogle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = new AuthenticateWithGoogleUseCase();
    await this.executeUseCase(useCase, { idToken: req.body.idToken }, res, next);
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = new RefreshTokenUseCase();
    await this.executeUseCase(useCase, { token: req.body.token }, res, next);
  }

  async completeOnboarding(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized'));
    }
    const { monthlyIncome, financialGoals, coachPersonality } = req.body;
    const useCase = new CompleteOnboardingUseCase();
    const monthlyIncomeNum = typeof monthlyIncome === 'string' ? parseFloat(monthlyIncome) : Number(monthlyIncome);
    await this.executeUseCase(
      useCase,
      {
        userId,
        monthlyIncome: monthlyIncomeNum,
        financialGoals: Array.isArray(financialGoals) ? financialGoals : [],
        coachPersonality: coachPersonality ?? '',
      },
      res,
      next
    );
  }
}
