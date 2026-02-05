import { BaseEntity } from "./BaseEntity";
import { QuizQuestion } from "./QuizQuestion";

export class Quiz extends BaseEntity {
  constructor(
    public userId: string,
    public title: string,
    public description: string,
    public concept: string, // Financial concept (e.g., "Budgeting", "Emergency Fund", "Debt Management")
    public questions: QuizQuestion[],
    public isCompleted: boolean = false,
    public completedAt?: Date,
    public score?: number, // Percentage score (0-100)
    public totalQuestions: number = questions.length,
    public answeredCorrectly: number = 0,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    if (createdAt) this.createdAt = createdAt;
    if (updatedAt) this.updatedAt = updatedAt;
    this.totalQuestions = questions.length;
  }
}
