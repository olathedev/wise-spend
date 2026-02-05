import { Quiz } from '../entities/Quiz';
import { IBaseRepository } from './IBaseRepository';

export interface IQuizRepository extends IBaseRepository<Quiz> {
  findByUserId(userId: string): Promise<Quiz[]>;
  findByUserIdAndCompleted(userId: string, completed: boolean): Promise<Quiz[]>;
  markAsCompleted(quizId: string, score: number, answeredCorrectly: number): Promise<Quiz | null>;
  countByUserId(userId: string): Promise<number>;
  deleteAllByUserId(userId: string): Promise<number>; // Returns count of deleted quizzes
}
