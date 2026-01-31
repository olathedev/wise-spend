import { IUseCase } from '@application/interfaces/IUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { NotFoundError } from '@shared/errors/AppError';

export interface CompleteOnboardingRequest {
  userId: string;
  monthlyIncome: number;
  financialGoals: string[];
  coachPersonality: string;
}

export interface CompleteOnboardingResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    monthlyIncome?: number;
    financialGoals?: string[];
    coachPersonality?: string;
  };
}

export class CompleteOnboardingUseCase
  implements IUseCase<CompleteOnboardingRequest, CompleteOnboardingResponse>
{
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async execute(
    request: CompleteOnboardingRequest
  ): Promise<CompleteOnboardingResponse> {
    const existing = await this.userRepository.findById(request.userId);
    if (!existing) {
      throw new NotFoundError('User not found');
    }

    const updated = await this.userRepository.update(request.userId, {
      monthlyIncome: request.monthlyIncome,
      financialGoals: request.financialGoals,
      coachPersonality: request.coachPersonality,
    });

    if (!updated) {
      throw new NotFoundError('User not found');
    }

    return {
      user: {
        id: updated.id!,
        email: updated.email,
        name: updated.name,
        picture: updated.picture,
        monthlyIncome: updated.monthlyIncome,
        financialGoals: updated.financialGoals,
        coachPersonality: updated.coachPersonality,
      },
    };
  }
}
