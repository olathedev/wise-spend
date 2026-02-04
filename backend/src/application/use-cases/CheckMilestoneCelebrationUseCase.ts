import { IUseCase } from "@application/interfaces/IUseCase";
import { UserRepository } from "@infrastructure/repositories/UserRepository";

export interface CheckMilestoneCelebrationRequest {
  userId: string;
  currentSavedAmount: number;
}

export interface CheckMilestoneCelebrationResponse {
  shouldCelebrate: boolean;
  milestoneAmount: number;
  message: string;
  monthsCloser?: number;
}

const MILESTONE_INCREMENT = 1000;

export class CheckMilestoneCelebrationUseCase
  implements
    IUseCase<
      CheckMilestoneCelebrationRequest,
      CheckMilestoneCelebrationResponse
    >
{
  async execute(
    request: CheckMilestoneCelebrationRequest,
  ): Promise<CheckMilestoneCelebrationResponse> {
    const userRepo = new UserRepository();
    const user = await userRepo.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { currentSavedAmount } = request;
    const lastCelebrated = user.lastCelebratedMilestone ?? 0;
    const nextMilestone =
      Math.floor(lastCelebrated / MILESTONE_INCREMENT + 1) * MILESTONE_INCREMENT;

    if (currentSavedAmount < nextMilestone) {
      return {
        shouldCelebrate: false,
        milestoneAmount: nextMilestone,
        message: "",
      };
    }

    const newLastCelebrated =
      Math.floor(currentSavedAmount / MILESTONE_INCREMENT) * MILESTONE_INCREMENT;
    await userRepo.update(request.userId, {
      lastCelebratedMilestone: newLastCelebrated,
    });

    const primaryGoalTarget = user.primaryGoalId
      ? user.goalTargets?.[user.primaryGoalId]
      : null;
    const monthlyIncome = user.monthlyIncome ?? 3000;
    const monthlySavings = Math.max(500, monthlyIncome * 0.2);
    const monthsCloser = primaryGoalTarget
      ? Math.round((newLastCelebrated - lastCelebrated) / monthlySavings)
      : undefined;

    const monthsStr =
      monthsCloser != null && monthsCloser > 0
        ? ` You're now approximately ${monthsCloser} month${monthsCloser !== 1 ? "s" : ""} closer to your goal!`
        : "";

    return {
      shouldCelebrate: true,
      milestoneAmount: newLastCelebrated,
      message: `🎉 You've saved $${newLastCelebrated.toLocaleString()}!${monthsStr} Small actions lead to big outcomes.`,
      monthsCloser,
    };
  }
}
