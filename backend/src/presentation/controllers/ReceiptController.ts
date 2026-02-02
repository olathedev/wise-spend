import { Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { AnalyzeReceiptUseCase } from "@application/use-cases/AnalyzeReceiptUseCase";
import { AuthRequest } from "@presentation/middleware/authMiddleware";
import { UnauthorizedError, ValidationError } from "@shared/errors/AppError";
import { uploadReceiptImage } from "@infrastructure/services/CloudinaryService";
import { ExpenseRepository } from "@infrastructure/repositories/ExpenseRepository";
import { Expense } from "@domain/entities/Expense";
import { parseReceiptTitleFromAnalysis } from "@shared/utils/parseReceiptTitle";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export class ReceiptController extends BaseController {
  async analyzeReceipt(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    const file = req.file;
    if (!file || !file.buffer) {
      return next(
        new ValidationError(
          "No image file uploaded. Use multipart/form-data with field 'image'.",
        ),
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return next(new ValidationError("Image must be 10MB or less."));
    }

    const mimeType = file.mimetype || "image/jpeg";
    if (!ALLOWED_MIMES.includes(mimeType)) {
      return next(
        new ValidationError(
          `Invalid image type. Allowed: ${ALLOWED_MIMES.join(", ")}`,
        ),
      );
    }

    const imageBase64 = file.buffer.toString("base64");
    const useCase = new AnalyzeReceiptUseCase();

    try {
      const { analysis } = await useCase.execute({
        userId,
        imageBase64,
        mimeType,
      });

      const imageUrl = await uploadReceiptImage(file.buffer, mimeType);
      const title = parseReceiptTitleFromAnalysis(analysis);

      const expenseRepo = new ExpenseRepository();
      const expense = await expenseRepo.create(
        new Expense(userId, imageUrl, title, analysis),
      );

      res.status(200).json({
        success: true,
        data: {
          analysis,
          expenseId: expense.id,
          title: expense.title,
          imageUrl: expense.imageUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async listExpenses(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    try {
      const expenseRepo = new ExpenseRepository();
      const expenses = await expenseRepo.findByUserId(userId);
      res.status(200).json({
        success: true,
        data: expenses.map((e) => ({
          id: e.id,
          imageUrl: e.imageUrl,
          title: e.title,
          aiDescription: e.aiDescription,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  }
}
