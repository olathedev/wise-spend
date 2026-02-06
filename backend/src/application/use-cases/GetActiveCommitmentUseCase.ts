import { IUseCase } from "@application/interfaces/IUseCase";
import { Commitment } from "@domain/entities/Commitment";
import { CommitmentRepository } from "@infrastructure/repositories/CommitmentRepository";
import { getDaysRemainingInWeek } from "@shared/utils/weekUtils";

export interface GetActiveCommitmentRequest {
  userId: string;
}

export interface GetActiveCommitmentResponse {
  commitment: Commitment | null;
  daysRemaining: number;
}

export class GetActiveCommitmentUseCase
  implements IUseCase<GetActiveCommitmentRequest, GetActiveCommitmentResponse>
{
  async execute(request: GetActiveCommitmentRequest): Promise<GetActiveCommitmentResponse> {
    const repo = new CommitmentRepository();
    const commitment = await repo.findActiveByUserId(request.userId);
    const daysRemaining = getDaysRemainingInWeek(new Date());
    return { commitment, daysRemaining };
  }
}
