import { IUseCase } from '@application/interfaces/IUseCase';
import { Quiz } from '@domain/entities/Quiz';
import { getAIService } from '@infrastructure/services';
import { QuizEvaluator } from '@infrastructure/services/QuizEvaluator';
import { QuizCuratorAgent } from '@infrastructure/services/QuizCuratorAgent';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { ExpenseRepository } from '@infrastructure/repositories/ExpenseRepository';
import { QuizRepository } from '@infrastructure/repositories/QuizRepository';
import { getOpikService } from '@infrastructure/services/OpikService';
import { Logger } from '@shared/utils/logger';
import { NotFoundError } from '@shared/errors/AppError';

export interface GenerateQuizzesRequest {
  userId: string;
  count?: number; // Number of quizzes to generate (default: 5)
}

export interface GenerateQuizzesResponse {
  quizzes: Quiz[];
  conceptsIdentified: string[];
  totalGenerated: number;
}

/**
 * Generate Quizzes Use Case
 * Creates personalized financial quizzes for a user based on their spending patterns
 */
/**
 * Normalize question text for deduplication (ignore numbers, names, spacing)
 */
function fingerprintQuestion(text: string, userName?: string): string {
  let s = text.toLowerCase().trim().replace(/\s+/g, ' ');
  if (userName) {
    s = s.replace(new RegExp(userName.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[name]');
  }
  s = s.replace(/\d+(\.\d+)?/g, '#');
  s = s.replace(/\$#+/g, '$#');
  return s;
}

export class GenerateQuizzesUseCase implements IUseCase<GenerateQuizzesRequest, GenerateQuizzesResponse> {
  private quizCuratorAgent: QuizCuratorAgent;
  private quizEvaluator: QuizEvaluator;
  private quizRepository: QuizRepository;
  private opikService = getOpikService();

  constructor(
    quizCuratorAgent?: QuizCuratorAgent,
    quizRepository?: QuizRepository,
  ) {
    const userRepo = new UserRepository();
    const expenseRepo = new ExpenseRepository();
    const aiService = getAIService();
    
    this.quizCuratorAgent = quizCuratorAgent || new QuizCuratorAgent(
      userRepo,
      expenseRepo,
      aiService,
    );
    this.quizEvaluator = new QuizEvaluator(aiService);
    this.quizRepository = quizRepository || new QuizRepository();
  }

  async execute(request: GenerateQuizzesRequest): Promise<GenerateQuizzesResponse> {
    const { userId } = request;
    const count = 1; // Single AI quiz card (5 questions); generating a new one replaces the current

    // Create Opik trace for quiz generation
    const trace = this.opikService.createTrace('generate-personalized-quizzes', {
      userId,
      requestedCount: count,
    }, {
      operation: 'quiz-generation',
      provider: 'google-genai',
    });

    try {
      // Load user context (no DB save — quiz returned in response only)
      const contextSpan = trace.span({
        name: 'load-user-financial-context',
        type: 'general',
        input: { userId },
      });

      const context = await this.quizCuratorAgent.loadUserContext(userId);
      contextSpan.end();

      // Identify one concept for the single quiz
      const conceptsSpan = trace.span({
        name: 'identify-relevant-concepts',
        type: 'general',
        input: {
          monthlySpending: context.monthlySpending,
          expenseCount: context.expenseSummary.count,
          hasGoals: (context.user.financialGoals?.length || 0) > 0,
        },
      });

      const concepts = this.quizCuratorAgent.identifyRelevantConcepts(context);
      conceptsSpan.end();

      const defaultConcepts = [
        'Budgeting Basics',
        'Emergency Fund',
        'Debt Management',
        'Investment Basics',
        'Credit Score',
        'Savings Strategies',
        'Financial Goal Setting',
        'Expense Tracking',
      ];

      const conceptsToGenerate: string[] = [];
      if (concepts.length > 0) {
        conceptsToGenerate.push(concepts[0]);
      }
      if (conceptsToGenerate.length === 0) {
        conceptsToGenerate.push(defaultConcepts[Math.floor(Math.random() * defaultConcepts.length)]);
      }

      const generateSpan = trace.span({
        name: 'generate-quizzes-for-concepts',
        type: 'llm',
        input: {
          conceptCount: 1,
          concepts: conceptsToGenerate,
        },
        metadata: {
          provider: 'google-genai',
        },
      });

      const rawQuizzes: Quiz[] = [];
      const concept = conceptsToGenerate[0];
      try {
        const quiz = await this.quizCuratorAgent.generateQuizForConcept(
          concept,
          context,
          [],
        );
        if (quiz) {
          rawQuizzes.push(quiz);
        }
      } catch (error) {
        Logger.error(`Failed to generate quiz for concept: ${concept}`, error);
        throw error;
      }

      const generatedQuizzes = this.deduplicateQuestionsAcrossQuizzes(
        rawQuizzes,
        context.user.name,
      );
      if (generatedQuizzes.length === 0) {
        throw new Error('Quiz generation failed. Please try again.');
      }

      // Assign temp id for response (not persisted)
      const quiz = generatedQuizzes[0];
      if (!quiz.id) {
        (quiz as { id?: string }).id = `quiz-${Date.now()}`;
      }

      // Optional: LLM-as-a-Judge evaluation (set EVALUATE_QUIZZES=true to enable)
      const evaluateQuizzes = process.env.EVALUATE_QUIZZES === 'true';
      if (evaluateQuizzes) {
        const evaluationSpan = trace.span({
          name: 'evaluate-quizzes-llm-judge',
          type: 'general',
          input: { quizCount: generatedQuizzes.length },
        });
        const evaluationResults: Array<{ concept: string; quizId?: string; score: number; evaluation: Record<string, number> }> = [];
        for (const quiz of generatedQuizzes) {
          try {
            const evalResult = await this.quizEvaluator.evaluateQuiz(
              quiz,
              quiz.concept,
              {
                monthlyIncome: context.user.monthlyIncome,
                monthlySpending: context.monthlySpending,
                goals: context.user.financialGoals,
              },
            );
            evaluationResults.push({
              concept: quiz.concept,
              quizId: quiz.id,
              score: evalResult.overallScore,
              evaluation: evalResult.evaluation,
            });
            Logger.info(`Quiz evaluation complete for ${quiz.concept}`, {
              score: evalResult.overallScore,
            });
          } catch (error) {
            Logger.error(`Failed to evaluate quiz: ${quiz.concept}`, error);
          }
        }
        evaluationSpan.update({
          output: {
            evaluatedCount: evaluationResults.length,
            averageScore: evaluationResults.length > 0
              ? evaluationResults.reduce((sum, r) => sum + r.score, 0) / evaluationResults.length
              : 0,
            results: evaluationResults,
          },
        });
        evaluationSpan.end();
      }

      generateSpan.end();

      // Update trace with results (no DB save)
      trace.update({
        output: {
          quizzesGenerated: generatedQuizzes.length,
          concepts: conceptsToGenerate,
        },
      });
      trace.end();

      return {
        quizzes: generatedQuizzes,
        conceptsIdentified: conceptsToGenerate,
        totalGenerated: generatedQuizzes.length,
      };
    } catch (error) {
      Logger.error('Error generating quizzes', error);
      
      trace.update({
        output: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        metadata: {
          error: true,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        },
      });
      trace.end();
      
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to generate quizzes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Remove duplicate/similar questions across quizzes. First occurrence wins.
   */
  private deduplicateQuestionsAcrossQuizzes(quizzes: Quiz[], userName?: string): Quiz[] {
    const seenFingerprints = new Set<string>();
    const result: Quiz[] = [];

    for (const quiz of quizzes) {
      const uniqueQuestions = quiz.questions.filter((q) => {
        const fp = fingerprintQuestion(q.question, userName);
        if (seenFingerprints.has(fp)) {
          Logger.info(`Deduplicating question across quizzes`, {
            concept: quiz.concept,
            questionPreview: q.question.substring(0, 60),
          });
          return false;
        }
        seenFingerprints.add(fp);
        return true;
      });

      if (uniqueQuestions.length >= 3) {
        result.push(
          new Quiz(
            quiz.userId,
            quiz.title,
            quiz.description,
            quiz.concept,
            uniqueQuestions,
          ),
        );
      } else {
        Logger.warn(`Quiz "${quiz.concept}" had too many duplicates (${uniqueQuestions.length} left), keeping all original questions`);
        result.push(quiz);
      }
    }

    return result;
  }
}
