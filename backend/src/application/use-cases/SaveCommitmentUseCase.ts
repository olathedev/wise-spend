import { IUseCase } from "@application/interfaces/IUseCase";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { CommitmentRepository } from "@infrastructure/repositories/CommitmentRepository";
import { Commitment } from "@domain/entities/Commitment";
import { getWeekOf } from "@shared/utils/weekUtils";

export interface SaveCommitmentRequest {
  userId: string;
  commitment: string;
}

export interface SaveCommitmentResponse {
  success: boolean;
  commitmentId?: string;
}

export class SaveCommitmentUseCase
  implements IUseCase<SaveCommitmentRequest, SaveCommitmentResponse>
{
  async execute(request: SaveCommitmentRequest): Promise<SaveCommitmentResponse> {
    const userRepo = new UserRepository();
    const commitmentRepo = new CommitmentRepository();

    const user = await userRepo.findById(request.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const weekOf = getWeekOf(new Date());
    const trimmed = request.commitment.trim();

    // Create Commitment record
    const commitment = new Commitment(user.id!, weekOf, trimmed, "active");
    const saved = await commitmentRepo.create(commitment);

    // Also update User for backward compatibility with existing features
    await userRepo.update(request.userId, {
      currentCommitment: trimmed,
      commitmentCreatedAt: new Date(),
      lastWeeklyCheckInAt: new Date(),
    });

    return { success: true, commitmentId: saved.id };
  }
}
