import { User } from '@domain/entities/User';
import { Expense } from '@domain/entities/Expense';
import { Quiz } from '@domain/entities/Quiz';
import { QuizQuestion } from '@domain/entities/QuizQuestion';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IExpenseRepository } from '@domain/repositories/IExpenseRepository';
import { IAIService } from '@domain/interfaces/IAIService';
import { Logger } from '@shared/utils/logger';
import { parseAmountFromTitle } from '@shared/utils/parseAmountFromTitle';

export interface UserFinancialContext {
  user: User;
  recentExpenses: Expense[];
  monthlySpending: number;
  expenseSummary: {
    total: number;
    count: number;
    categories: Record<string, number>;
    averagePerTransaction: number;
  };
}

/**
 * Quiz Curator Agent
 * Generates personalized financial quizzes based on user's spending patterns,
 * transactions, and financial data. Each quiz focuses on concepts relevant
 * to the user's financial situation.
 */
export class QuizCuratorAgent {
  constructor(
    private userRepository: IUserRepository,
    private expenseRepository: IExpenseRepository,
    private aiService: IAIService,
  ) {}

  /**
   * Load complete financial context for a user
   */
  async loadUserContext(userId: string): Promise<UserFinancialContext> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const expenses = await this.expenseRepository.findByUserId(userId);
    
    // Calculate monthly spending (current month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = expense.createdAt || new Date();
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    // Calculate spending summary
    const expenseAmounts = currentMonthExpenses.map((exp) => {
      const amount = parseAmountFromTitle(exp.title);
      return Math.abs(amount);
    });

    const monthlySpending = expenseAmounts.reduce((sum, amount) => sum + amount, 0);
    
    // Categorize expenses
    const categories: Record<string, number> = {};
    currentMonthExpenses.forEach((exp) => {
      const amount = Math.abs(parseAmountFromTitle(exp.title));
      const title = exp.title.toLowerCase();
      
      let category = 'Other';
      if (title.includes('coffee') || title.includes('cafe') || title.includes('starbucks')) {
        category = 'Coffee & Drinks';
      } else if (title.includes('grocery') || title.includes('food') || title.includes('restaurant')) {
        category = 'Food & Dining';
      } else if (title.includes('gas') || title.includes('fuel') || title.includes('uber') || title.includes('lyft')) {
        category = 'Transportation';
      } else if (title.includes('amazon') || title.includes('shopping') || title.includes('store')) {
        category = 'Shopping';
      } else if (title.includes('subscription') || title.includes('netflix') || title.includes('spotify')) {
        category = 'Subscriptions';
      }
      
      categories[category] = (categories[category] || 0) + amount;
    });

    const expenseSummary = {
      total: monthlySpending,
      count: currentMonthExpenses.length,
      categories,
      averagePerTransaction: currentMonthExpenses.length > 0 
        ? monthlySpending / currentMonthExpenses.length 
        : 0,
    };

    return {
      user,
      recentExpenses: expenses.slice(0, 20),
      monthlySpending,
      expenseSummary,
    };
  }

  /**
   * Identify relevant financial concepts for the user based on their data
   */
  identifyRelevantConcepts(context: UserFinancialContext): string[] {
    const concepts: string[] = [];
    const { user, expenseSummary, monthlySpending } = context;
    const monthlyIncome = user.monthlyIncome;

    // Budgeting concepts
    if (monthlyIncome && monthlySpending > 0) {
      const spendingPercentage = (monthlySpending / monthlyIncome) * 100;
      if (spendingPercentage > 80) {
        concepts.push('Budgeting Basics', 'Emergency Fund', 'Expense Reduction');
      } else if (spendingPercentage > 60) {
        concepts.push('Budgeting Basics', '50/30/20 Rule', 'Savings Strategies');
      } else {
        concepts.push('Advanced Budgeting', 'Investment Basics', 'Wealth Building');
      }
    }

    // Category-specific concepts
    if (expenseSummary.categories['Coffee & Drinks'] > 100) {
      concepts.push('Small Expense Tracking', 'Daily Spending Habits');
    }
    if (expenseSummary.categories['Subscriptions']) {
      concepts.push('Subscription Management', 'Recurring Expenses');
    }
    if (expenseSummary.categories['Shopping'] > 200) {
      concepts.push('Impulse Buying', 'Needs vs Wants');
    }

    // Goal-based concepts
    if (user.financialGoals && user.financialGoals.length > 0) {
      if (user.financialGoals.includes('emergency')) {
        concepts.push('Emergency Fund', 'Financial Safety Net');
      }
      if (user.financialGoals.includes('debt')) {
        concepts.push('Debt Management', 'Debt Payoff Strategies');
      }
      if (user.financialGoals.includes('home') || user.financialGoals.includes('house')) {
        concepts.push('Home Buying', 'Down Payment Planning');
      }
      if (user.financialGoals.includes('retirement')) {
        concepts.push('Retirement Planning', 'Long-term Investing');
      }
    }

    // Income-based concepts
    if (!monthlyIncome) {
      concepts.push('Income Planning', 'Financial Goal Setting');
    }

    // Default concepts if none identified
    if (concepts.length === 0) {
      concepts.push(
        'Budgeting Basics',
        'Emergency Fund',
        'Financial Goal Setting',
        'Expense Tracking',
      );
    }

    // Remove duplicates and return unique concepts
    return Array.from(new Set(concepts));
  }

  /**
   * Generate a personalized quiz for a specific financial concept
   */
  async generateQuizForConcept(
    concept: string,
    context: UserFinancialContext,
  ): Promise<Quiz> {
    const prompt = this.buildQuizGenerationPrompt(concept, context);
    
    try {
      const response = await this.aiService.generateText(prompt, {
        temperature: 0.7, // Higher temperature for more variety in questions
        maxTokens: 4000, // Increased for more questions
      });

      // Log raw response for debugging
      Logger.info(`Raw AI response for ${concept}`, {
        responseLength: response.length,
        firstChars: response.substring(0, 200),
        lastChars: response.substring(Math.max(0, response.length - 200)),
      });

      // Parse the AI response to extract quiz data
      const quizData = this.parseQuizResponse(response, concept);
      
      Logger.info(`Successfully parsed quiz for ${concept}`, {
        title: quizData.title,
        questionCount: quizData.questions.length,
      });
      
      return new Quiz(
        context.user.id!,
        quizData.title,
        quizData.description,
        concept,
        quizData.questions,
      );
    } catch (error) {
      Logger.error(`Error generating quiz for concept: ${concept}`, {
        concept,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      // Fallback to a basic quiz structure
      return this.createFallbackQuiz(concept, context);
    }
  }

  /**
   * Build prompt for AI to generate personalized quiz
   */
  private buildQuizGenerationPrompt(
    concept: string,
    context: UserFinancialContext,
  ): string {
    const { user, expenseSummary, monthlySpending } = context;
    const monthlyIncome = user.monthlyIncome;
    
    return `You are a financial education expert creating a personalized quiz for a user learning about "${concept}".

USER'S FINANCIAL PROFILE:
- Name: ${user.name}
- Monthly Income: ${monthlyIncome ? `$${monthlyIncome.toLocaleString()}` : 'Not set'}
- Monthly Spending: $${monthlySpending.toLocaleString()}
- Total Transactions This Month: ${expenseSummary.count}
- Average Transaction: $${expenseSummary.averagePerTransaction.toFixed(2)}
- Top Spending Categories: ${Object.entries(expenseSummary.categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat, amt]) => `${cat} ($${amt.toFixed(2)})`)
      .join(', ') || 'None'}
- Financial Goals: ${user.financialGoals?.join(', ') || 'None set'}
- Wise Score: ${user.wiseScore !== undefined ? `${user.wiseScore}/1000` : 'Not calculated'}

TASK:
Create a personalized quiz about "${concept}" with AT LEAST 5 questions (aim for 8-10 for best learning). The quiz should:
1. Be relevant to the user's actual financial situation
2. Reference their spending patterns, income, or goals when appropriate
3. Include practical, actionable questions (not just theoretical)
4. Use their real data in examples when possible
5. Cover different difficulty levels (beginner to intermediate)
6. Each question must be UNIQUE and cover different aspects of ${concept}
7. Vary question types: calculations, scenarios, definitions, best practices
8. Ensure questions are diverse - no repetition or similar wording

OUTPUT FORMAT (JSON):
{
  "title": "Quiz title (e.g., 'Mastering Budgeting Basics')",
  "description": "Brief description explaining why this quiz is relevant to the user",
  "questions": [
    {
      "question": "Question text (can reference user's data, e.g., 'If your monthly income is $X and you spend $Y on coffee...')",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct, with actionable advice"
    }
  ]
}

CRITICAL REQUIREMENTS:
- Generate exactly 8-10 questions (no more, no less)
- Each question must have exactly 4 options
- correctAnswer must be a number: 0, 1, 2, or 3 (0-based index)
- Return ONLY valid JSON - no markdown, no code blocks, no extra text before or after
- The response must start with { and end with }
- Do not include any explanatory text outside the JSON object

EXAMPLE VALID RESPONSE:
{
  "title": "Mastering Budgeting Basics",
  "description": "Test your budgeting knowledge with personalized questions",
  "questions": [
    {
      "question": "If your monthly income is $5000 and you spend $3000, what percentage are you spending?",
      "options": ["40%", "50%", "60%", "70%"],
      "correctAnswer": 2,
      "explanation": "60% spending means you're saving 40%, which is good but could be improved."
    }
  ]
}`;
  }

  /**
   * Parse AI response into quiz structure
   */
  private parseQuizResponse(
    response: string,
    concept: string,
  ): {
    title: string;
    description: string;
    questions: QuizQuestion[];
  } {
    try {
      // Log the raw response for debugging
      Logger.debug(`Parsing quiz response for concept: ${concept}`, {
        responsePreview: response.substring(0, 500),
        responseLength: response.length,
      });

      // Try to extract JSON from response (handle markdown code blocks)
      let jsonStr = response.trim();
      
      // Remove markdown code blocks
      if (jsonStr.includes('```json')) {
        const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonStr = jsonMatch[1].trim();
        }
      } else if (jsonStr.includes('```')) {
        const codeMatch = jsonStr.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch && codeMatch[1]) {
          jsonStr = codeMatch[1].trim();
        }
      }

      // Try to find JSON object in the string if it's embedded in text
      if (!jsonStr.startsWith('{')) {
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        }
      }

      const parsed = JSON.parse(jsonStr);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        Logger.error('Invalid quiz format', {
          concept,
          hasQuestions: !!parsed.questions,
          questionsType: typeof parsed.questions,
          parsedKeys: Object.keys(parsed),
        });
        throw new Error('Invalid quiz format: missing questions array');
      }

      // Validate questions structure and ensure uniqueness
      const validQuestions: any[] = [];
      const seenQuestions = new Set<string>();
      
      parsed.questions.forEach((q: any, index: number) => {
        // Basic validation
        if (!q || typeof q.question !== 'string' || !Array.isArray(q.options)) {
          Logger.warn(`Skipping invalid question ${index + 1}`, { question: q });
          return;
        }
        
        // Ensure exactly 4 options
        if (q.options.length !== 4) {
          Logger.warn(`Question ${index + 1} has ${q.options.length} options, expected 4`, { question: q.question });
          return;
        }
        
        // Validate correctAnswer is a valid index
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          Logger.error(`Question ${index + 1} has invalid correctAnswer: ${q.correctAnswer}`, {
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          });
          return;
        }
        
        // Check for duplicate questions (normalize by removing extra spaces and converting to lowercase)
        const normalizedQuestion = q.question.toLowerCase().trim().replace(/\s+/g, ' ');
        if (seenQuestions.has(normalizedQuestion)) {
          Logger.warn(`Skipping duplicate question: ${q.question.substring(0, 50)}...`);
          return;
        }
        seenQuestions.add(normalizedQuestion);
        
        // Validate explanation exists
        if (!q.explanation || typeof q.explanation !== 'string') {
          Logger.warn(`Question ${index + 1} missing explanation, using default`);
          q.explanation = 'No explanation provided.';
        }
        
        validQuestions.push(q);
      });

      // Ensure we have at least 5 questions
      if (validQuestions.length < 5) {
        Logger.error('Not enough valid questions', {
          concept,
          validQuestions: validQuestions.length,
          totalQuestions: parsed.questions.length,
          required: 5,
        });
        throw new Error(`Only ${validQuestions.length} valid questions found, need at least 5`);
      }

      Logger.info(`Validated ${validQuestions.length} unique questions for concept: ${concept}`);

      const questions = validQuestions.map(
        (q: any, index: number) => {
          // Double-check correctAnswer is valid
          const correctAnswer = typeof q.correctAnswer === 'number' && 
                                q.correctAnswer >= 0 && 
                                q.correctAnswer <= 3 
                                ? q.correctAnswer 
                                : 0;
          
          // Ensure options array has exactly 4 items
          const options = Array.isArray(q.options) && q.options.length === 4
            ? q.options
            : ['Option A', 'Option B', 'Option C', 'Option D'];
          
          Logger.debug(`Question ${index + 1} final validation`, {
            question: q.question.substring(0, 50),
            optionsCount: options.length,
            correctAnswer,
            correctAnswerType: typeof correctAnswer,
          });
          
          return new QuizQuestion(
            q.question || `Question ${index + 1}`,
            options,
            correctAnswer,
            q.explanation || 'No explanation provided',
            concept,
          );
        },
      );

      return {
        title: parsed.title || `Quiz: ${concept}`,
        description:
          parsed.description ||
          `Test your knowledge about ${concept} with this personalized quiz.`,
        questions,
      };
    } catch (error) {
      Logger.error('Error parsing quiz response', {
        concept,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
        } : error,
        responsePreview: response.substring(0, 1000),
      });
      throw new Error(`Failed to parse quiz response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a fallback quiz if AI generation fails
   * Ensures at least 5 questions
   */
  private createFallbackQuiz(
    concept: string,
    context: UserFinancialContext,
  ): Quiz {
    const monthlyIncome = context.user.monthlyIncome || 0;
    const monthlySpending = context.monthlySpending;
    
    const fallbackQuestions: QuizQuestion[] = [
      new QuizQuestion(
        `What is the primary purpose of ${concept}?`,
        [
          'To track all expenses',
          'To save money effectively',
          'To understand financial principles',
          'To invest in stocks',
        ],
        2,
        `${concept} helps you understand key financial principles that apply to your situation.`,
        concept,
      ),
      new QuizQuestion(
        `Based on your monthly spending of $${monthlySpending.toLocaleString()}, what percentage of your income should go to savings?`,
        ['10%', '20%', '30%', '40%'],
        1,
        'The 50/30/20 rule suggests 20% of income should go to savings and debt repayment.',
        concept,
      ),
      new QuizQuestion(
        `Which strategy is most effective for ${concept}?`,
        [
          'Setting it and forgetting it',
          'Regular review and adjustment',
          'Only tracking major expenses',
          'Avoiding all spending',
        ],
        1,
        `Regular review and adjustment is key to successful ${concept.toLowerCase()}.`,
        concept,
      ),
      new QuizQuestion(
        `How often should you review your ${concept.toLowerCase()} progress?`,
        [
          'Once a year',
          'Monthly',
          'Weekly',
          'Daily',
        ],
        1,
        `Monthly reviews help you stay on track with ${concept.toLowerCase()} goals.`,
        concept,
      ),
      new QuizQuestion(
        `What is the most important factor in ${concept.toLowerCase()}?`,
        [
          'Having a high income',
          'Consistency and discipline',
          'Complex strategies',
          'Avoiding all expenses',
        ],
        1,
        `Consistency and discipline are more important than income level for ${concept.toLowerCase()}.`,
        concept,
      ),
    ];

    Logger.warn(`Using fallback quiz for concept: ${concept}`, {
      questionCount: fallbackQuestions.length,
    });

    return new Quiz(
      context.user.id!,
      `Understanding ${concept}`,
      `Learn the fundamentals of ${concept} with this personalized quiz.`,
      concept,
      fallbackQuestions,
    );
  }
}
