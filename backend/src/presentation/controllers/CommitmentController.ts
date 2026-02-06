import { Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { AuthRequest } from "@presentation/middleware/authMiddleware";
import { UnauthorizedError, ValidationError } from "@shared/errors/AppError";
import { SaveCommitmentUseCase } from "@application/use-cases/SaveCommitmentUseCase";
import { GetActiveCommitmentUseCase } from "@application/use-cases/GetActiveCommitmentUseCase";
import { GetLatestCommitmentUseCase } from "@application/use-cases/GetLatestCommitmentUseCase";
import { MidWeekUpdateCommitmentUseCase } from "@application/use-cases/MidWeekUpdateCommitmentUseCase";
import { CompleteCommitmentUseCase } from "@application/use-cases/CompleteCommitmentUseCase";

export class CommitmentController extends BaseController {
  async saveCommitment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const commitment = req.body?.commitment;
    if (!commitment || typeof commitment !== "string" || !commitment.trim()) {
      return next(new ValidationError("commitment is required"));
    }

    const useCase = new SaveCommitmentUseCase();
    await this.executeUseCase(useCase, { userId, commitment: commitment.trim() }, res, next);
  }

  async getActiveCommitment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const useCase = new GetActiveCommitmentUseCase();
    try {
      const result = await useCase.execute({ userId });
      res.status(200).json({
        success: true,
        data: result.commitment
          ? {
              id: result.commitment.id,
              weekOf: result.commitment.weekOf,
              commitmentText: result.commitment.commitmentText,
              status: result.commitment.status,
              midWeekCheckInDate: result.commitment.midWeekCheckInDate,
              midWeekResponse: result.commitment.midWeekResponse,
              midWeekReminderSentAt: result.commitment.midWeekReminderSentAt,
              aiObservations: result.commitment.aiObservations,
              completionSelfReport: result.commitment.completionSelfReport,
              createdAt: result.commitment.createdAt,
            }
          : null,
        daysRemaining: result.daysRemaining,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLatestCommitment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const useCase = new GetLatestCommitmentUseCase();
    try {
      const result = await useCase.execute({ userId });
      res.status(200).json({
        success: true,
        data: result.commitment
          ? {
              id: result.commitment.id,
              weekOf: result.commitment.weekOf,
              commitmentText: result.commitment.commitmentText,
              status: result.commitment.status,
              midWeekCheckInDate: result.commitment.midWeekCheckInDate,
              midWeekResponse: result.commitment.midWeekResponse,
              completionSelfReport: result.commitment.completionSelfReport,
              aiObservations: result.commitment.aiObservations,
              createdAt: result.commitment.createdAt,
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  }

  async midWeekUpdate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const commitmentId = Array.isArray(req.params?.id) ? req.params.id[0] : req.params?.id;
    if (!commitmentId) return next(new ValidationError("commitment id is required"));

    const midWeekResponse = req.body?.midWeekResponse;
    if (!midWeekResponse || typeof midWeekResponse !== "string" || !midWeekResponse.trim()) {
      return next(new ValidationError("midWeekResponse is required"));
    }

    const useCase = new MidWeekUpdateCommitmentUseCase();
    await this.executeUseCase(
      useCase,
      { userId, commitmentId, midWeekResponse: midWeekResponse.trim() },
      res,
      next,
    );
  }

  async completeCommitment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const commitmentId = Array.isArray(req.params?.id) ? req.params.id[0] : req.params?.id;
    if (!commitmentId) return next(new ValidationError("commitment id is required"));

    const completionSelfReport = req.body?.completionSelfReport;
    if (!completionSelfReport || typeof completionSelfReport !== "string" || !completionSelfReport.trim()) {
      return next(new ValidationError("completionSelfReport is required"));
    }

    const status = req.body?.status;
    if (status && !["completed", "abandoned"].includes(status)) {
      return next(new ValidationError("status must be 'completed' or 'abandoned'"));
    }

    const useCase = new CompleteCommitmentUseCase();
    await this.executeUseCase(
      useCase,
      { userId, commitmentId, completionSelfReport: completionSelfReport.trim(), status },
      res,
      next,
    );
  }
}
