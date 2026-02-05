import { IUseCase } from "@application/interfaces/IUseCase";
import { DailyAssessmentModel } from "@infrastructure/models/DailyAssessmentModel";

export interface GetDailyAssessmentStatusRequest {
  userId: string;
}

export interface GetDailyAssessmentStatusResponse {
  shouldShow: boolean;
  streak: number;
  totalCompleted: number;
  lastCompletedAt: string | null;
  completedDates: string[];
}

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  const today = getTodayISO();
  if (sorted[0] !== today) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i]);
    const curr = new Date(sorted[i - 1]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export class GetDailyAssessmentStatusUseCase
  implements
    IUseCase<
      GetDailyAssessmentStatusRequest,
      GetDailyAssessmentStatusResponse
    >
{
  async execute(
    request: GetDailyAssessmentStatusRequest
  ): Promise<GetDailyAssessmentStatusResponse> {
    const today = getTodayISO();

    const todayEntry = await DailyAssessmentModel.findOne({
      userId: request.userId,
      date: today,
    }).lean();

    const completedEntries = await DailyAssessmentModel.find({
      userId: request.userId,
      status: "completed",
    })
      .sort({ date: -1 })
      .lean();

    const completedDates = completedEntries.map((e) => e.date);
    const streak = computeStreak(completedDates);
    const lastCompleted = completedEntries[0]?.date ?? null;

    return {
      shouldShow: !todayEntry,
      streak,
      totalCompleted: completedDates.length,
      lastCompletedAt: lastCompleted,
      completedDates,
    };
  }
}
