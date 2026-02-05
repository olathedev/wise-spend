import { IUseCase } from '@application/interfaces/IUseCase';
import { QuizRepository } from '@infrastructure/repositories/QuizRepository';
import { Logger } from '@shared/utils/logger';

export interface DeleteAllQuizzesRequest {
  userId: string;
}

export interface DeleteAllQuizzesResponse {
  deletedCount: number;
}

/**
 * Delete All Quizzes Use Case
 * Deletes all quizzes for a user (useful for clearing and regenerating)
 */
export class DeleteAllQuizzesUseCase implements IUseCase<DeleteAllQuizzesRequest, DeleteAllQuizzesResponse> {
  private quizRepository: QuizRepository;

  constructor(quizRepository?: QuizRepository) {
    this.quizRepository = quizRepository || new QuizRepository();
  }

  async execute(request: DeleteAllQuizzesRequest): Promise<DeleteAllQuizzesResponse> {
    const { userId } = request;

    try {
      const deletedCount = await this.quizRepository.deleteAllByUserId(userId);
      
      Logger.info(`Deleted all quizzes for user`, {
        userId,
        deletedCount,
      });

      return {
        deletedCount,
      };
    } catch (error) {
      Logger.error('Error deleting all quizzes', {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to delete quizzes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
