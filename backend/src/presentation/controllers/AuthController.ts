import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { AuthenticateWithGoogleUseCase } from "@application/use-cases/AuthenticateWithGoogleUseCase";
import { CompleteOnboardingUseCase } from "@application/use-cases/CompleteOnboardingUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/RefreshTokenUseCase";
import { AuthRequest } from "@presentation/middleware/authMiddleware";
import { UnauthorizedError, NotFoundError, ValidationError } from "@shared/errors/AppError";
import { User } from "@domain/entities/User";
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
    const { monthlyIncome, financialGoals, coachPersonality, goalTargets, primaryGoalId, goalDeadlines, weeklyCheckInDay } = req.body;
    const userRepo = new UserRepository();

    try {
      const updates: Record<string, unknown> = {};
      
      // Debug logging - log entire request body
      console.log("=== Update Profile Request ===");
      console.log("Full req.body:", JSON.stringify(req.body, null, 2));
      console.log("Destructured values:", {
        monthlyIncome,
        financialGoals,
        coachPersonality,
        goalTargets,
        goalTargetsType: typeof goalTargets,
        goalTargetsIsArray: Array.isArray(goalTargets),
        goalTargetsKeys: goalTargets && typeof goalTargets === 'object' ? Object.keys(goalTargets) : 'N/A',
      });
      
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
      // Handle goalTargets - access directly from req.body to avoid destructuring issues
      const goalTargetsValue = req.body.goalTargets !== undefined ? req.body.goalTargets : goalTargets;
      
    
      
      if (goalTargetsValue !== undefined && goalTargetsValue !== null) {
        // Validate goalTargets is an object with string keys and number values
        if (typeof goalTargetsValue === "object" && !Array.isArray(goalTargetsValue)) {
          const validated: Record<string, number> = {};
          let hasValidTarget = false;
          
          for (const [key, value] of Object.entries(goalTargetsValue)) {
            if (typeof key !== "string" || key.trim() === "") {
              continue; // Skip invalid keys
            }
            const num = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : Number(value);
            if (Number.isFinite(num) && num > 0) {
              validated[key] = num;
              hasValidTarget = true;
            } else {
              console.warn(`Invalid goal target value for key "${key}":`, value, typeof value);
            }
          }
          
          if (hasValidTarget) {
            updates.goalTargets = validated;
            console.log("Validated goalTargets:", validated);
          } else {
            return next(new ValidationError(`All goal target values must be positive numbers. Received: ${JSON.stringify(goalTargetsValue)}`));
          }
        } else {
          return next(new ValidationError(`Invalid goalTargets format: must be an object, got ${typeof goalTargetsValue} (${Array.isArray(goalTargetsValue) ? 'array' : typeof goalTargetsValue})`));
        }
      } else {
        console.log("goalTargets is undefined or null in request body");
      }
      if (coachPersonality !== undefined) {
        updates.coachPersonality = coachPersonality ?? "";
      }
      if (primaryGoalId !== undefined) {
        updates.primaryGoalId = typeof primaryGoalId === "string" && primaryGoalId.trim() ? primaryGoalId.trim() : null;
      }
      if (goalDeadlines !== undefined && typeof goalDeadlines === "object" && !Array.isArray(goalDeadlines)) {
        const validated: Record<string, string> = {};
        for (const [key, value] of Object.entries(goalDeadlines)) {
          if (typeof key === "string" && typeof value === "string") {
            validated[key] = value;
          }
        }
        updates.goalDeadlines = validated;
      }
      if (weeklyCheckInDay !== undefined) {
        const day = Number(weeklyCheckInDay);
        updates.weeklyCheckInDay = Number.isFinite(day) && day >= 0 && day <= 6 ? day : 0;
      }

      if (Object.keys(updates).length === 0) {
        return next(new ValidationError("No valid fields to update"));
      }
      const updated = await userRepo.update(userId, updates as Partial<User>);
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
          goalTargets: updated.goalTargets ?? null,
          primaryGoalId: updated.primaryGoalId ?? null,
          goalDeadlines: updated.goalDeadlines ?? null,
          weeklyCheckInDay: updated.weeklyCheckInDay ?? null,
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
          goalTargets: user.goalTargets ?? null,
          primaryGoalId: user.primaryGoalId ?? null,
          goalDeadlines: user.goalDeadlines ?? null,
          weeklyCheckInDay: user.weeklyCheckInDay ?? null,
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
