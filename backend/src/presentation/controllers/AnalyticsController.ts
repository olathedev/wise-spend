import { Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { AuthRequest } from "@presentation/middleware/authMiddleware";
import { UnauthorizedError } from "@shared/errors/AppError";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { ExpenseRepository } from "@infrastructure/repositories/ExpenseRepository";
import { parseAmountFromTitle } from "@shared/utils/parseAmountFromTitle";
import { getAIService } from "@infrastructure/services";

export class AnalyticsController extends BaseController {
  /** GET /ai/analytics/summary – current/last month spending & counts, wise score */
  async getSummary(
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
      const expenseRepo = new ExpenseRepository();
      const user = await userRepo.findById(userId);
      const expenses = await expenseRepo.findByUserId(userId);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      let currentMonthSpending = 0;
      let currentMonthCount = 0;
      let lastMonthSpending = 0;
      let lastMonthCount = 0;

      for (const e of expenses) {
        const d = e.createdAt ? new Date(e.createdAt) : null;
        if (!d) continue;
        // Use aiDescription as fallback, same as frontend
        const amount = parseAmountFromTitle(e.title, e.aiDescription);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          currentMonthSpending += amount;
          currentMonthCount += 1;
        } else if (
          d.getFullYear() === lastMonthYear &&
          d.getMonth() === lastMonth
        ) {
          lastMonthSpending += amount;
          lastMonthCount += 1;
        }
      }

      res.status(200).json({
        success: true,
        data: {
          currentMonthSpending: Math.round(currentMonthSpending * 100) / 100,
          lastMonthSpending: Math.round(lastMonthSpending * 100) / 100,
          currentMonthCount,
          lastMonthCount,
          wiseScore: user?.wiseScore ?? null,
          wiseScoreTier: user?.wiseScoreTier ?? null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET /ai/analytics/heatmap – spending/count per day for current month */
  async getHeatmap(
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

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const dayAmount: Record<number, number> = {};
      const dayCount: Record<number, number> = {};
      for (let d = 1; d <= 31; d++) {
        dayAmount[d] = 0;
        dayCount[d] = 0;
      }

      for (const e of expenses) {
        const d = e.createdAt ? new Date(e.createdAt) : null;
        if (!d || d.getFullYear() !== year || d.getMonth() !== month) continue;
        const day = d.getDate();
        // Use aiDescription as fallback, same as frontend
        const amount = parseAmountFromTitle(e.title, e.aiDescription);
        dayAmount[day] += amount;
        dayCount[day] += 1;
      }

      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
        (day) => ({
          day,
          amount: Math.round(dayAmount[day] * 100) / 100,
          count: dayCount[day],
        }),
      );

      res.status(200).json({
        success: true,
        data: { year, month: month + 1, daysInMonth, days },
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET /ai/analytics/behavioral – AI-generated one-line insight from recent expenses */
  async getBehavioral(
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
      const userRepo = new UserRepository();
      const expenses = await expenseRepo.findByUserId(userId);
      const user = await userRepo.findById(userId);

      const recent = expenses.slice(0, 15);
      if (recent.length === 0) {
        res.status(200).json({
          success: true,
          data: { insight: null, userName: user?.name ?? "You" },
        });
        return;
      }

      const summary = recent
        .map((e) => {
          const d = e.createdAt ? new Date(e.createdAt) : null;
          const dateStr = d ? d.toISOString().slice(0, 10) : "?";
          return `${dateStr}: ${e.title}`;
        })
        .join("\n");

      const firstName = user?.name?.split(/\s+/)[0] ?? "You";
      const prompt = `Based ONLY on this user's recent receipt/expense list, write ONE short sentence (max 25 words) about a spending pattern or tip. Be specific and friendly. No preamble. If no clear pattern, suggest "Add more receipts to unlock insights."
Recent expenses:
${summary}`;

      const ai = getAIService();
      const content = await ai.generateText(prompt, {
        temperature: 0.5,
        maxTokens: 120,
      });

      const insight =
        content && content.trim().length > 0 ? content.trim() : null;

      res.status(200).json({
        success: true,
        data: { insight, userName: firstName },
      });
    } catch (error) {
      next(error);
    }
  }
}
