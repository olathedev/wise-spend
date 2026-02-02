import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { AuthenticateWithGoogleUseCase } from "@application/use-cases/AuthenticateWithGoogleUseCase";
import { CompleteOnboardingUseCase } from "@application/use-cases/CompleteOnboardingUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/RefreshTokenUseCase";
import { AuthRequest } from "@presentation/middleware/authMiddleware";
import { UnauthorizedError, NotFoundError } from "@shared/errors/AppError";
import { UserRepository } from "@infrastructure/repositories/UserRepository";

export class AuthController extends BaseController {
  async authenticateWithGoogle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const useCase = new AuthenticateWithGoogleUseCase();
    await this.executeUseCase(
      useCase,
      { idToken: req.body.idToken },
      res,
      next,
    );
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const useCase = new RefreshTokenUseCase();
    await this.executeUseCase(useCase, { token: req.body.token }, res, next);
  }

  async completeOnboarding(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }
    const { monthlyIncome, financialGoals, coachPersonality } = req.body;
    const useCase = new CompleteOnboardingUseCase();
    const monthlyIncomeNum =
      typeof monthlyIncome === "string" ? parseFloat(monthlyIncome) : Number(monthlyIncome);
    await this.executeUseCase(
      useCase,
      {
        userId,
        monthlyIncome: monthlyIncomeNum,
        financialGoals: Array.isArray(financialGoals) ? financialGoals : [],
        coachPersonality: coachPersonality ?? "",
      },
      res,
      next,
    );
  }

  async getCurrentUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    try {
      const userRepo = new UserRepository();
      const user = await userRepo.findById(userId);
      if (!user) {
        return next(new NotFoundError("User not found"));
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          googleId: user.googleId,
          onboardingCompleted: user.onboardingCompleted,
          monthlyIncome: user.monthlyIncome ?? null,
          financialGoals: user.financialGoals ?? null,
          coachPersonality: user.coachPersonality ?? null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
