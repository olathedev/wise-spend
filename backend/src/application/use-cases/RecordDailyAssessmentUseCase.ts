import mongoose from "mongoose";
import { IUseCase } from "@application/interfaces/IUseCase";
import { DailyAssessmentModel } from "@infrastructure/models/DailyAssessmentModel";

export interface RecordDailyAssessmentRequest {
  userId: string;
  status: "completed" | "skipped";
  score?: number;
}

export interface RecordDailyAssessmentResponse {
  success: boolean;
  streak: number;
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
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

export class RecordDailyAssessmentUseCase
  implements IUseCase<RecordDailyAssessmentRequest, RecordDailyAssessmentResponse>
{
  async execute(
    request: RecordDailyAssessmentRequest
  ): Promise<RecordDailyAssessmentResponse> {
    const today = getTodayISO();

    const userIdObj = new mongoose.Types.ObjectId(request.userId);
    await DailyAssessmentModel.findOneAndUpdate(
      { userId: userIdObj, date: today },
      {
        userId: userIdObj,
        date: today,
        status: request.status,
        score: request.score,
      },
      { upsert: true, new: true }
    );

    const completedEntries = await DailyAssessmentModel.find({
      userId: userIdObj,
      status: "completed",
    })
      .sort({ date: -1 })
      .lean();
    const completedDates = completedEntries.map((e) => e.date);
    const streak = computeStreak(completedDates);

    return { success: true, streak };
  }
}
