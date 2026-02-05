import { IUseCase } from '@application/interfaces/IUseCase';
import { Quiz } from '@domain/entities/Quiz';
import { QuizRepository } from '@infrastructure/repositories/QuizRepository';
import { Logger } from '@shared/utils/logger';

export interface GetQuizzesRequest {
  userId: string;
  completed?: boolean; // Filter by completion status (optional)
  limit?: number; // Limit number of results
  offset?: number; // Pagination offset
}

export interface GetQuizzesResponse {
  quizzes: Quiz[];
  total: number;
  completed: number;
  pending: number;
}

/**
 * Get Quizzes Use Case
 * Retrieves quizzes for a user, optionally filtered by completion status
 */
export class GetQuizzesUseCase implements IUseCase<GetQuizzesRequest, GetQuizzesResponse> {
  private quizRepository: QuizRepository;

  constructor(quizRepository?: QuizRepository) {
    this.quizRepository = quizRepository || new QuizRepository();
  }

  async execute(request: GetQuizzesRequest): Promise<GetQuizzesResponse> {
    const { userId, completed, limit, offset = 0 } = request;

    try {
      let quizzes: Quiz[];

      if (completed !== undefined) {
        // Filter by completion status
        quizzes = await this.quizRepository.findByUserIdAndCompleted(userId, completed);
      } else {
        // Get all quizzes
        quizzes = await this.quizRepository.findByUserId(userId);
      }

      // Calculate stats
      const allQuizzes = await this.quizRepository.findByUserId(userId);
      const completedCount = allQuizzes.filter(q => q.isCompleted).length;
      const pendingCount = allQuizzes.length - completedCount;

      // Apply pagination if specified
      if (limit !== undefined) {
        quizzes = quizzes.slice(offset, offset + limit);
      }

      return {
        quizzes,
        total: allQuizzes.length,
        completed: completedCount,
        pending: pendingCount,
      };
    } catch (error) {
      Logger.error('Error getting quizzes', error);
      throw new Error(`Failed to get quizzes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
