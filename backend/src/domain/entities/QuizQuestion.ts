export class QuizQuestion {
  constructor(
    public question: string,
    public options: string[],
    public correctAnswer: number, // Index of correct option (0-based)
    public explanation: string,
    public concept?: string, // Financial concept this question covers
  ) {}
}
