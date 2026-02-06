import { Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { AuthRequest } from "@presentation/middleware/authMiddleware";
import { UnauthorizedError, NotFoundError, ValidationError } from "@shared/errors/AppError";
import { GetCashFlowForecastUseCase } from "@application/use-cases/GetCashFlowForecastUseCase";
import { RecurringBillRepository } from "@infrastructure/repositories/RecurringBillRepository";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { RecurringBill } from "@domain/entities/RecurringBill";
import { User } from "@domain/entities/User";

export class ForecastController extends BaseController {
  async getCashFlow(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const useCase = new GetCashFlowForecastUseCase();
    try {
      const result = await useCase.execute({ userId });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateFinancialInfo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const userRepo = new UserRepository();
    const updates: Record<string, unknown> = {};

    if (req.body.nextPaydayDate !== undefined) {
      const d = new Date(req.body.nextPaydayDate);
      if (isNaN(d.getTime())) {
        return next(new ValidationError("Invalid nextPaydayDate"));
      }
      updates.nextPaydayDate = d;
    }
    if (req.body.paydayFrequency !== undefined) {
      const freq = req.body.paydayFrequency;
      if (!["weekly", "biweekly", "monthly"].includes(freq)) {
        return next(new ValidationError("paydayFrequency must be weekly, biweekly, or monthly"));
      }
      updates.paydayFrequency = freq;
    }
    if (req.body.averageMonthlyIncome !== undefined) {
      const n = Number(req.body.averageMonthlyIncome);
      if (!Number.isFinite(n) || n < 0) {
        return next(new ValidationError("Invalid averageMonthlyIncome"));
      }
      updates.averageMonthlyIncome = n;
    }
    if (req.body.currentBalance !== undefined) {
      const n = Number(req.body.currentBalance);
      if (!Number.isFinite(n)) {
        return next(new ValidationError("Invalid currentBalance"));
      }
      updates.currentBalance = n;
    }

    try {
      const updated = await userRepo.update(userId, updates as Partial<User>);
      if (!updated) return next(new NotFoundError("User not found"));
      res.status(200).json({
        success: true,
        data: {
          nextPaydayDate: updated.nextPaydayDate,
          paydayFrequency: updated.paydayFrequency,
          averageMonthlyIncome: updated.averageMonthlyIncome,
          currentBalance: updated.currentBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async listRecurringBills(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const repo = new RecurringBillRepository();
    const bills = await repo.findByUserId(userId);
    res.status(200).json({
      success: true,
      data: bills.map((b) => ({
        id: b.id,
        name: b.name,
        amount: b.amount,
        dueDay: b.dueDay,
        frequency: b.frequency,
        isActive: b.isActive,
        nextDueDate: b.nextDueDate,
      })),
    });
  }

  async createRecurringBill(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const { name, amount, dueDay, frequency } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return next(new ValidationError("name is required"));
    }
    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum < 0) {
      return next(new ValidationError("Invalid amount"));
    }
    const dueDayNum = Number(dueDay);
    if (!Number.isFinite(dueDayNum) || dueDayNum < 0 || dueDayNum > 31) {
      return next(new ValidationError("dueDay must be 0-31"));
    }
    if (!["weekly", "monthly", "yearly"].includes(frequency)) {
      return next(new ValidationError("frequency must be weekly, monthly, or yearly"));
    }

    const nextDue = computeNextDueDate(dueDayNum, frequency);
    const bill = new RecurringBill(userId, name.trim(), amountNum, dueDayNum, frequency, nextDue);

    const repo = new RecurringBillRepository();
    const saved = await repo.create(bill);
    res.status(201).json({
      success: true,
      data: {
        id: saved.id,
        name: saved.name,
        amount: saved.amount,
        dueDay: saved.dueDay,
        frequency: saved.frequency,
        isActive: saved.isActive,
        nextDueDate: saved.nextDueDate,
      },
    });
  }

  async updateRecurringBill(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) return next(new ValidationError("id is required"));

    const repo = new RecurringBillRepository();
    const bill = await repo.findById(id);
    if (!bill || bill.userId !== userId) {
      return next(new NotFoundError("Recurring bill not found"));
    }

    const updates: Partial<RecurringBill> = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    if (req.body.amount !== undefined) {
      const n = Number(req.body.amount);
      if (!Number.isFinite(n) || n < 0) {
        return next(new ValidationError("Invalid amount"));
      }
      updates.amount = n;
    }
    if (req.body.dueDay !== undefined) {
      const n = Number(req.body.dueDay);
      if (!Number.isFinite(n) || n < 0 || n > 31) {
        return next(new ValidationError("dueDay must be 0-31"));
      }
      updates.dueDay = n;
    }
    if (req.body.frequency !== undefined) {
      if (!["weekly", "monthly", "yearly"].includes(req.body.frequency)) {
        return next(new ValidationError("Invalid frequency"));
      }
      updates.frequency = req.body.frequency;
    }
    if (req.body.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);
    if (updates.dueDay !== undefined || updates.frequency !== undefined) {
      updates.nextDueDate = computeNextDueDate(
        updates.dueDay ?? bill.dueDay,
        updates.frequency ?? bill.frequency,
      );
    }

    const updated = await repo.update(id, updates);
    if (!updated) return next(new NotFoundError("Recurring bill not found"));
    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        amount: updated.amount,
        dueDay: updated.dueDay,
        frequency: updated.frequency,
        isActive: updated.isActive,
        nextDueDate: updated.nextDueDate,
      },
    });
  }

  async deleteRecurringBill(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) return next(new ValidationError("id is required"));

    const repo = new RecurringBillRepository();
    const bill = await repo.findById(id);
    if (!bill || bill.userId !== userId) {
      return next(new NotFoundError("Recurring bill not found"));
    }

    await repo.delete(id);
    res.status(200).json({ success: true, message: "Deleted" });
  }
}

function computeNextDueDate(dueDay: number, frequency: string): Date {
  const now = new Date();
  if (frequency === "weekly") {
    const target = dueDay >= 0 && dueDay <= 6 ? dueDay : 0;
    const diff = (target - now.getDay() + 7) % 7;
    const next = new Date(now);
    next.setDate(next.getDate() + (diff === 0 ? 7 : diff));
    return next;
  }
  if (frequency === "monthly") {
    const day = Math.min(dueDay, 28);
    const next = new Date(now.getFullYear(), now.getMonth(), day);
    if (next <= now) next.setMonth(next.getMonth() + 1);
    return next;
  }
  if (frequency === "yearly") {
    const day = Math.min(dueDay, 28);
    const next = new Date(now.getFullYear(), 0, day);
    if (next <= now) next.setFullYear(next.getFullYear() + 1);
    return next;
  }
  return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
}
