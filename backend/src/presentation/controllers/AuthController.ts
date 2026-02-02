import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { AuthenticateWithGoogleUseCase } from "@application/use-cases/AuthenticateWithGoogleUseCase";
import { CompleteOnboardingUseCase } from "@application/use-cases/CompleteOnboardingUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/RefreshTokenUseCase";
import { AuthRequest } from "@presentation/middleware/authMiddleware";
import { UnauthorizedError, NotFoundError, ValidationError } from "@shared/errors/AppError";
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
    const raw =
      typeof monthlyIncome === "string"
        ? parseFloat(monthlyIncome.replace(/,/g, "").trim())
        : Number(monthlyIncome);
    const monthlyIncomeNum = Number.isFinite(raw) && raw >= 0 ? raw : 0;
    if (monthlyIncome != null && monthlyIncome !== "" && !Number.isFinite(raw)) {
      return next(new ValidationError("Invalid monthly income"));
    }
    const useCase = new CompleteOnboardingUseCase();
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

  async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }
    const { monthlyIncome, financialGoals, coachPersonality } = req.body;
    const userRepo = new UserRepository();

    try {
      const updates: Record<string, unknown> = {};
      if (monthlyIncome !== undefined) {
        const raw =
          typeof monthlyIncome === "string"
            ? parseFloat(String(monthlyIncome).replace(/,/g, "").trim())
            : Number(monthlyIncome);
        if (!Number.isFinite(raw) || raw < 0) {
          return next(new ValidationError("Invalid monthly income"));
        }
        updates.monthlyIncome = raw;
      }
      if (financialGoals !== undefined) {
        updates.financialGoals = Array.isArray(financialGoals) ? financialGoals : [];
      }
      if (coachPersonality !== undefined) {
        updates.coachPersonality = coachPersonality ?? "";
      }
      if (Object.keys(updates).length === 0) {
        return next(new ValidationError("No valid fields to update"));
      }
      const updated = await userRepo.update(userId, updates as { monthlyIncome?: number; financialGoals?: string[]; coachPersonality?: string });
      if (!updated) {
        return next(new NotFoundError("User not found"));
      }
      res.status(200).json({
        success: true,
        data: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          picture: updated.picture,
          googleId: updated.googleId,
          onboardingCompleted: updated.onboardingCompleted,
          monthlyIncome: updated.monthlyIncome ?? null,
          financialGoals: updated.financialGoals ?? null,
          coachPersonality: updated.coachPersonality ?? null,
          wiseScore: updated.wiseScore ?? null,
          wiseScoreUpdatedAt: updated.wiseScoreUpdatedAt ?? null,
          wiseScoreTier: updated.wiseScoreTier ?? null,
        },
      });
    } catch (error) {
      next(error);
    }
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
          wiseScore: user.wiseScore ?? null,
          wiseScoreUpdatedAt: user.wiseScoreUpdatedAt ?? null,
          wiseScoreTier: user.wiseScoreTier ?? null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
