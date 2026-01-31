import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { AuthenticateWithGoogleUseCase } from "@application/use-cases/AuthenticateWithGoogleUseCase";
import { RefreshTokenUseCase } from "@application/use-cases/RefreshTokenUseCase";
import { SaveOnboardingDataUseCase } from "@application/use-cases/SaveOnboardingDataUseCase";

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

  async saveOnboardingData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const useCase = new SaveOnboardingDataUseCase();
    await this.executeUseCase(
      useCase,
      { ...req.body, userId: (req as any).user?.userId },
      res,
      next,
    );
  }
}
