import { IUseCase } from "@application/interfaces/IUseCase";
import { UserRepository } from "@infrastructure/repositories/UserRepository";

export interface SaveCommitmentRequest {
  userId: string;
  commitment: string;
}

export interface SaveCommitmentResponse {
  success: boolean;
}

export class SaveCommitmentUseCase
  implements IUseCase<SaveCommitmentRequest, SaveCommitmentResponse>
{
  async execute(
    request: SaveCommitmentRequest,
  ): Promise<SaveCommitmentResponse> {
    const userRepo = new UserRepository();
    const user = await userRepo.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await userRepo.update(request.userId, {
      currentCommitment: request.commitment.trim(),
      commitmentCreatedAt: new Date(),
      lastWeeklyCheckInAt: new Date(),
    });

    return { success: true };
  }
}
