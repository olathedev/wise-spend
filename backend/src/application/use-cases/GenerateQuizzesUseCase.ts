import { IUseCase } from '@application/interfaces/IUseCase';
import { Quiz } from '@domain/entities/Quiz';
import { getAIService } from '@infrastructure/services';
import { QuizCuratorAgent } from '@infrastructure/services/QuizCuratorAgent';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { ExpenseRepository } from '@infrastructure/repositories/ExpenseRepository';
import { QuizRepository } from '@infrastructure/repositories/QuizRepository';
import { getOpikService } from '@infrastructure/services/OpikService';
import { Logger } from '@shared/utils/logger';
import { NotFoundError } from '@shared/errors/AppError';

export interface GenerateQuizzesRequest {
  userId: string;
  count?: number; // Number of quizzes to generate (default: 10)
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
export class GenerateQuizzesUseCase implements IUseCase<GenerateQuizzesRequest, GenerateQuizzesResponse> {
  private quizCuratorAgent: QuizCuratorAgent;
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
    this.quizRepository = quizRepository || new QuizRepository();
  }

  async execute(request: GenerateQuizzesRequest): Promise<GenerateQuizzesResponse> {
    const { userId, count = 10 } = request;

    // Create Opik trace for quiz generation
    const trace = this.opikService.createTrace('generate-personalized-quizzes', {
      userId,
      requestedCount: count,
    }, {
      operation: 'quiz-generation',
      provider: 'google-genai',
    });

    try {
      // Load user context
      const contextSpan = trace.span({
        name: 'load-user-financial-context',
        type: 'general',
        input: { userId },
      });

      const context = await this.quizCuratorAgent.loadUserContext(userId);
      contextSpan.end();

      // Identify relevant concepts
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

      // Check existing quizzes to avoid duplicates
      const existingQuizzes = await this.quizRepository.findByUserId(userId);
      const existingConcepts = new Set(existingQuizzes.map(q => q.concept));

      // Filter out concepts that already have quizzes
      const newConcepts = concepts.filter(c => !existingConcepts.has(c));

      // If we need more quizzes, add some default concepts
      const conceptsToGenerate = newConcepts.slice(0, count);
      if (conceptsToGenerate.length < count) {
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
        
        for (const concept of defaultConcepts) {
          if (conceptsToGenerate.length >= count) break;
          if (!existingConcepts.has(concept)) {
            conceptsToGenerate.push(concept);
          }
        }
      }

      // Generate quizzes for each concept
      const generateSpan = trace.span({
        name: 'generate-quizzes-for-concepts',
        type: 'llm',
        input: {
          conceptCount: conceptsToGenerate.length,
          concepts: conceptsToGenerate,
        },
        metadata: {
          provider: 'google-genai',
        },
      });

      const quizPromises = conceptsToGenerate.map(async (concept) => {
        try {
          const quiz = await this.quizCuratorAgent.generateQuizForConcept(concept, context);
          return quiz;
        } catch (error) {
          Logger.error(`Failed to generate quiz for concept: ${concept}`, error);
          return null;
        }
      });

      const generatedQuizzes = (await Promise.all(quizPromises)).filter(
        (quiz): quiz is Quiz => quiz !== null,
      );

      generateSpan.end();

      // Save quizzes to database
      const saveSpan = trace.span({
        name: 'save-quizzes-to-database',
        type: 'general',
        input: {
          quizCount: generatedQuizzes.length,
        },
      });

      const savedQuizzes: Quiz[] = [];
      for (const quiz of generatedQuizzes) {
        try {
          const saved = await this.quizRepository.create(quiz);
          savedQuizzes.push(saved);
        } catch (error) {
          Logger.error(`Failed to save quiz: ${quiz.title}`, error);
        }
      }

      saveSpan.end();

      // Update trace with results
      trace.update({
        output: {
          quizzesGenerated: savedQuizzes.length,
          concepts: conceptsToGenerate,
        },
      });
      trace.end();

      return {
        quizzes: savedQuizzes,
        conceptsIdentified: conceptsToGenerate,
        totalGenerated: savedQuizzes.length,
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
}
