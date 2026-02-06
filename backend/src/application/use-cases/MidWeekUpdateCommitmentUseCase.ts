import { IUseCase } from "@application/interfaces/IUseCase";
import { CommitmentRepository } from "@infrastructure/repositories/CommitmentRepository";
import { NotFoundError } from "@shared/errors/AppError";

export interface MidWeekUpdateCommitmentRequest {
  userId: string;
  commitmentId: string;
  midWeekResponse: string;
}

export interface MidWeekUpdateCommitmentResponse {
  success: boolean;
}

export class MidWeekUpdateCommitmentUseCase
  implements IUseCase<MidWeekUpdateCommitmentRequest, MidWeekUpdateCommitmentResponse>
{
  async execute(request: MidWeekUpdateCommitmentRequest): Promise<MidWeekUpdateCommitmentResponse> {
    const repo = new CommitmentRepository();
    const commitment = await repo.findById(request.commitmentId);
    if (!commitment) {
      throw new NotFoundError("Commitment not found");
    }
    if (commitment.userId !== request.userId) {
      throw new NotFoundError("Commitment not found");
    }
    if (commitment.status !== "active") {
      throw new Error("Commitment is no longer active");
    }

    await repo.update(request.commitmentId, {
      midWeekCheckInDate: new Date(),
      midWeekResponse: request.midWeekResponse.trim(),
    });

    return { success: true };
  }
}
