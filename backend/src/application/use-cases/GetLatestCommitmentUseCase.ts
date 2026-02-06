import { IUseCase } from "@application/interfaces/IUseCase";
import { Commitment } from "@domain/entities/Commitment";
import { CommitmentRepository } from "@infrastructure/repositories/CommitmentRepository";

export interface GetLatestCommitmentRequest {
  userId: string;
}

export interface GetLatestCommitmentResponse {
  commitment: Commitment | null;
}

export class GetLatestCommitmentUseCase
  implements IUseCase<GetLatestCommitmentRequest, GetLatestCommitmentResponse>
{
  async execute(request: GetLatestCommitmentRequest): Promise<GetLatestCommitmentResponse> {
    const repo = new CommitmentRepository();
    const commitment = await repo.findLatestByUserId(request.userId);
    return { commitment };
  }
}
