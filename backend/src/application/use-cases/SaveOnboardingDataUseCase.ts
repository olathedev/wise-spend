import { IUseCase } from "@application/interfaces/IUseCase";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserRepository } from "@infrastructure/repositories/UserRepository";

export interface SaveOnboardingDataRequest {
  userId: string;
  monthlyIncome: string;
  financialGoals: string[];
  coachPersonality: string;
}

export interface SaveOnboardingDataResponse {
  success: boolean;
}

export class SaveOnboardingDataUseCase implements IUseCase<
  SaveOnboardingDataRequest,
  SaveOnboardingDataResponse
> {
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async execute(
    request: SaveOnboardingDataRequest,
  ): Promise<SaveOnboardingDataResponse> {
    const { userId, ...onboardingData } = request;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.update(userId, {
      onboardingCompleted: true,
      monthlyIncome: Number(onboardingData.monthlyIncome),
      financialGoals: onboardingData.financialGoals,
      coachPersonality: onboardingData.coachPersonality,
    });

    return { success: true };
  }
}
