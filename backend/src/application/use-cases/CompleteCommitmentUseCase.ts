import { IUseCase } from "@application/interfaces/IUseCase";
import { CommitmentRepository } from "@infrastructure/repositories/CommitmentRepository";
import { NotFoundError } from "@shared/errors/AppError";

export interface CompleteCommitmentRequest {
  userId: string;
  commitmentId: string;
  completionSelfReport: string;
  status?: "completed" | "abandoned";
}

export interface CompleteCommitmentResponse {
  success: boolean;
}

export class CompleteCommitmentUseCase
  implements IUseCase<CompleteCommitmentRequest, CompleteCommitmentResponse>
{
  async execute(request: CompleteCommitmentRequest): Promise<CompleteCommitmentResponse> {
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

    const status = request.status || "completed";
    await repo.update(request.commitmentId, {
      status,
      completionSelfReport: request.completionSelfReport.trim(),
    });

    return { success: true };
  }
}
