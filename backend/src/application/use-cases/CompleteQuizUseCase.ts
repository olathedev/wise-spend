import { IUseCase } from '@application/interfaces/IUseCase';
import { Quiz } from '@domain/entities/Quiz';
import { QuizRepository } from '@infrastructure/repositories/QuizRepository';
import { Logger } from '@shared/utils/logger';
import { NotFoundError } from '@shared/errors/AppError';
import { getDatabase } from '@infrastructure/database';

export interface CompleteQuizRequest {
  userId: string;
  quizId: string;
  answers: number[]; // Array of selected answer indices (0-based)
}

export interface CompleteQuizResponse {
  quiz: Quiz;
  score: number;
  answeredCorrectly: number;
  totalQuestions: number;
}

/**
 * Complete Quiz Use Case
 * Marks a quiz as completed and calculates the score based on user answers
 */
export class CompleteQuizUseCase implements IUseCase<CompleteQuizRequest, CompleteQuizResponse> {
  private quizRepository: QuizRepository;

  constructor(quizRepository?: QuizRepository) {
    this.quizRepository = quizRepository || new QuizRepository();
  }

  async execute(request: CompleteQuizRequest): Promise<CompleteQuizResponse> {
    const { userId, quizId, answers } = request;

    try {
      // Ensure database connection is active
      try {
        const db = getDatabase();
        await db.ensureConnection();
      } catch (dbError) {
        Logger.error('Database connection issue', dbError);
        throw new Error('Database connection unavailable. Please try again in a moment.');
      }

      // Get the quiz
      const quiz = await this.quizRepository.findById(quizId);
      
      if (!quiz) {
        throw new NotFoundError('Quiz not found');
      }

      // Verify quiz belongs to user
      if (quiz.userId !== userId) {
        throw new Error('Quiz does not belong to this user');
      }

      // Check if already completed
      if (quiz.isCompleted) {
        return {
          quiz,
          score: quiz.score || 0,
          answeredCorrectly: quiz.answeredCorrectly,
          totalQuestions: quiz.totalQuestions,
        };
      }

      // Validate answers array length
      if (answers.length !== quiz.questions.length) {
        Logger.error('Answers array length mismatch', {
          answersLength: answers.length,
          questionsLength: quiz.questions.length,
          quizId,
        });
        throw new Error(`Answers array length (${answers.length}) does not match questions length (${quiz.questions.length})`);
      }

      // Calculate score
      let correctCount = 0;
      const answerDetails: Array<{ questionIndex: number; userAnswer: number; correctAnswer: number; isCorrect: boolean }> = [];
      
      quiz.questions.forEach((question, index) => {
        const userAnswer = answers[index];
        const correctAnswer = question.correctAnswer;
        const isCorrect = userAnswer === correctAnswer;
        
        answerDetails.push({
          questionIndex: index,
          userAnswer,
          correctAnswer,
          isCorrect,
        });
        
        if (isCorrect) {
          correctCount++;
        }
      });

      Logger.info('Quiz completion details', {
        quizId,
        userId,
        totalQuestions: quiz.questions.length,
        correctCount,
        answerDetails,
      });

      const totalQuestions = quiz.questions.length;
      const score = Math.round((correctCount / totalQuestions) * 100);

      // Mark as completed
      const updatedQuiz = await this.quizRepository.markAsCompleted(
        quizId,
        score,
        correctCount,
      );

      if (!updatedQuiz) {
        throw new Error('Failed to update quiz');
      }

      return {
        quiz: updatedQuiz,
        score,
        answeredCorrectly: correctCount,
        totalQuestions,
      };
    } catch (error) {
      Logger.error('Error completing quiz', {
        userId,
        quizId,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : undefined,
        // Check if it's a MongoDB connection error
        isMongoError: error instanceof Error && (
          error.message.includes('ReplicaSetNoPrimary') ||
          error.message.includes('MongoServerError') ||
          error.message.includes('connection') ||
          error.name === 'MongoServerError'
        ),
      });
      
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('ReplicaSetNoPrimary') || error.message.includes('connection')) {
          throw new Error('Database connection issue. Please try again in a moment.');
        }
        throw new Error(`Failed to complete quiz: ${error.message}`);
      }
      
      throw new Error(`Failed to complete quiz: Unknown error`);
    }
  }
}
