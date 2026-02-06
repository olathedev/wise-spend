import { IUseCase } from "@application/interfaces/IUseCase";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { ExpenseRepository } from "@infrastructure/repositories/ExpenseRepository";
import { RecurringBillRepository } from "@infrastructure/repositories/RecurringBillRepository";
import { NotFoundError } from "@shared/errors/AppError";
import { parseAmountFromTitle } from "@shared/utils/parseAmountFromTitle";

export interface GetCashFlowForecastRequest {
  userId: string;
}

export type ForecastStatus = "safe" | "tight" | "warning";

export interface UpcomingBillDto {
  id: string;
  name: string;
  amount: number;
  nextDueDate: Date;
  frequency: string;
}

export interface GetCashFlowForecastResponse {
  currentBalance: number;
  daysUntilPayday: number;
  upcomingBills: UpcomingBillDto[];
  upcomingBillsTotal: number;
  predictedVariableSpending: number;
  projectedBalance: number;
  status: ForecastStatus;
  shortfall?: number;
}

export class GetCashFlowForecastUseCase
  implements IUseCase<GetCashFlowForecastRequest, GetCashFlowForecastResponse>
{
  async execute(
    request: GetCashFlowForecastRequest,
  ): Promise<GetCashFlowForecastResponse> {
    const userRepo = new UserRepository();
    const expenseRepo = new ExpenseRepository();
    const billRepo = new RecurringBillRepository();

    const user = await userRepo.findById(request.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const currentBalance = user.currentBalance ?? 0;
    const nextPayday = user.nextPaydayDate ? new Date(user.nextPaydayDate) : null;

    if (!nextPayday) {
      return {
        currentBalance,
        daysUntilPayday: 0,
        upcomingBills: [],
        upcomingBillsTotal: 0,
        predictedVariableSpending: 0,
        projectedBalance: currentBalance,
        status: "safe",
      };
    }

    const paydayEnd = new Date(nextPayday);
    paydayEnd.setHours(23, 59, 59, 999);

    const daysUntilPayday = Math.max(
      0,
      Math.ceil((paydayEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
    );

    const upcomingBills = await billRepo.findDueBetween(request.userId, now, paydayEnd);
    const upcomingBillsTotal = upcomingBills.reduce((sum, b) => sum + b.amount, 0);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expenses = await expenseRepo.findByUserId(request.userId);
    const recentExpenses = expenses.filter((e) => {
      const d = e.createdAt ? new Date(e.createdAt) : null;
      return d && d >= thirtyDaysAgo;
    });

    const totalLast30Days = recentExpenses.reduce((sum, e) => {
      const amount = parseAmountFromTitle(e.title, e.aiDescription);
      return sum + Math.abs(amount);
    }, 0);

    const avgDailySpending = totalLast30Days / 30;
    const predictedVariableSpending = avgDailySpending * daysUntilPayday;

    const projectedBalance =
      currentBalance - upcomingBillsTotal - predictedVariableSpending;

    let status: ForecastStatus = "safe";
    let shortfall: number | undefined;

    if (projectedBalance < 0) {
      status = "warning";
      shortfall = Math.abs(projectedBalance);
    } else if (projectedBalance < 100) {
      status = "tight";
    }

    return {
      currentBalance,
      daysUntilPayday,
      upcomingBills: upcomingBills.map((b) => ({
        id: b.id!,
        name: b.name,
        amount: b.amount,
        nextDueDate: b.nextDueDate,
        frequency: b.frequency,
      })),
      upcomingBillsTotal,
      predictedVariableSpending,
      projectedBalance,
      status,
      shortfall,
    };
  }
}
