import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { GenerateQuizzesUseCase, GenerateQuizzesRequest } from '@application/use-cases/GenerateQuizzesUseCase';
import { GetQuizzesUseCase, GetQuizzesRequest } from '@application/use-cases/GetQuizzesUseCase';
import { CompleteQuizUseCase, CompleteQuizRequest } from '@application/use-cases/CompleteQuizUseCase';
import { DeleteAllQuizzesUseCase, DeleteAllQuizzesRequest } from '@application/use-cases/DeleteAllQuizzesUseCase';
import { AuthRequest } from '@presentation/middleware/authMiddleware';
import { UnauthorizedError, ValidationError } from '@shared/errors/AppError';

export class QuizController extends BaseController {
  /**
   * Generate personalized quizzes for the logged-in user
   * POST /api/quiz/generate
   */
  async generateQuizzes(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const request: GenerateQuizzesRequest = {
      userId,
      count: 1, // Single quiz card (5 questions); generating again replaces the current one
    };

    const useCase = new GenerateQuizzesUseCase();
    
    try {
      const result = await useCase.execute(request);
      res.status(200).json({
        success: true,
        data: {
          quizzes: result.quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            concept: quiz.concept,
            questions: quiz.questions.map(q => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer, // Include correct answer
              explanation: q.explanation,
              concept: q.concept,
            })),
            isCompleted: quiz.isCompleted,
            totalQuestions: quiz.totalQuestions,
            createdAt: quiz.createdAt,
          })),
          conceptsIdentified: result.conceptsIdentified,
          totalGenerated: result.totalGenerated,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get quizzes for the logged-in user
   * GET /api/quiz?completed=true&limit=10&offset=0
   */
  async getQuizzes(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const request: GetQuizzesRequest = {
      userId,
      completed: req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
    };

    const useCase = new GetQuizzesUseCase();
    
    try {
      const result = await useCase.execute(request);
      res.status(200).json({
        success: true,
        data: {
          quizzes: result.quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            concept: quiz.concept,
            questions: quiz.questions.map(q => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer, // Include correct answer
              explanation: q.explanation,
              concept: q.concept,
            })),
            isCompleted: quiz.isCompleted,
            completedAt: quiz.completedAt,
            score: quiz.score,
            totalQuestions: quiz.totalQuestions,
            answeredCorrectly: quiz.answeredCorrectly,
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt,
          })),
          stats: {
            total: result.total,
            completed: result.completed,
            pending: result.pending,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete a quiz and calculate score
   * POST /api/quiz/:quizId/complete
   */
  async completeQuiz(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const quizId = Array.isArray(req.params.quizId) ? req.params.quizId[0] : req.params.quizId;
    if (!quizId) {
      return next(new ValidationError('Quiz ID is required'));
    }

    // Validate answers array
    if (!req.body.answers || !Array.isArray(req.body.answers)) {
      return next(new ValidationError('Answers array is required'));
    }

    const request: CompleteQuizRequest = {
      userId,
      quizId,
      answers: req.body.answers,
    };

    const useCase = new CompleteQuizUseCase();
    
    try {
      const result = await useCase.execute(request);
      res.status(200).json({
        success: true,
        data: {
          quiz: {
            id: result.quiz.id,
            title: result.quiz.title,
            description: result.quiz.description,
            concept: result.quiz.concept,
            isCompleted: result.quiz.isCompleted,
            completedAt: result.quiz.completedAt,
            score: result.score,
            answeredCorrectly: result.answeredCorrectly,
            totalQuestions: result.totalQuestions,
          },
          score: result.score,
          answeredCorrectly: result.answeredCorrectly,
          totalQuestions: result.totalQuestions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all quizzes for the logged-in user
   * DELETE /api/quiz/all
   */
  async deleteAllQuizzes(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const request: DeleteAllQuizzesRequest = {
      userId,
    };

    const useCase = new DeleteAllQuizzesUseCase();
    
    try {
      const result = await useCase.execute(request);
      res.status(200).json({
        success: true,
        data: {
          deletedCount: result.deletedCount,
          message: `Successfully deleted ${result.deletedCount} quiz${result.deletedCount !== 1 ? 'zes' : ''}`,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
