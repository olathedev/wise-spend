import { User } from '@domain/entities/User';
import { Expense } from '@domain/entities/Expense';
import { Quiz } from '@domain/entities/Quiz';
import { QuizQuestion } from '@domain/entities/QuizQuestion';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IExpenseRepository } from '@domain/repositories/IExpenseRepository';
import { IAIService } from '@domain/interfaces/IAIService';
import { Logger } from '@shared/utils/logger';
import { parseAmountFromTitle } from '@shared/utils/parseAmountFromTitle';
import { getOpikService } from './OpikService';

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
   * @param alreadyUsedQuestions - Question texts from other quizzes in this batch (avoid duplicates)
   */
  async generateQuizForConcept(
    concept: string,
    context: UserFinancialContext,
    alreadyUsedQuestions: string[] = [],
  ): Promise<Quiz> {
    const prompt = this.buildQuizGenerationPrompt(concept, context, alreadyUsedQuestions);
    const opikService = getOpikService();
    
    // Create Opik trace with input/output structure for LLM-as-a-Judge evaluation.
    // Trace input must be flat so Opik shows input.concept, input.userContext, etc. in the rule mapper.
    const quizTrace = opikService.createTrace('generate-quiz-for-concept', {
      concept,
      userContext: {
        name: context.user.name,
        monthlyIncome: context.user.monthlyIncome,
        monthlySpending: context.monthlySpending,
        goals: context.user.financialGoals,
      },
      promptPreview: prompt.substring(0, 500),
    }, {
      operation: 'quiz-generation',
      concept,
      provider: 'google-genai',
    });
    
    try {
      // Generate with retry logic for truncated responses
      let response = '';
      let attempts = 0;
      const maxAttempts = 2;
      
      while (attempts < maxAttempts) {
        try {
          response = await this.aiService.generateText(prompt, {
            temperature: 0.4,
            maxTokens: 1600,
          });
          
          // Check if response looks complete (ends with } or ])
          if (response.trim().endsWith('}') || response.trim().endsWith(']')) {
            break; // Response looks complete
          }
          
          attempts++;
          if (attempts < maxAttempts) {
            Logger.warn(`Response may be truncated, retrying (attempt ${attempts + 1}/${maxAttempts})`, {
              concept,
              responseLength: response.length,
              lastChars: response.substring(Math.max(0, response.length - 100)),
            });
          }
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw error;
          }
          Logger.warn(`Error generating quiz, retrying (attempt ${attempts + 1}/${maxAttempts})`, {
            concept,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

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
      
      const quiz = new Quiz(
        context.user.id!,
        quizData.title,
        quizData.description,
        concept,
        quizData.questions,
      );
      
      // Update trace with OUTPUT for Opik LLM-as-a-Judge evaluation
      quizTrace.update({
        output: {
          quiz: {
            title: quizData.title,
            description: quizData.description,
            concept,
            questionCount: quizData.questions.length,
            questions: quizData.questions.map(q => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            })),
          },
          rawResponse: response.substring(0, 1000), // First 1000 chars for evaluation
        },
        metadata: {
          questionCount: quizData.questions.length,
          success: true,
        },
      });
      quizTrace.end();
      
      return quiz;
    } catch (error) {
      Logger.error(`Error generating quiz for concept: ${concept}`, {
        concept,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      
      // Update trace with error
      quizTrace.update({
        output: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        metadata: {
          success: false,
          error: true,
        },
      });
      quizTrace.end();
      throw error;
    }
  }

  /**
   * Minimal prompt for quiz generation (cost-optimized: small input, tight output).
   */
  private buildQuizGenerationPrompt(
    concept: string,
    context: UserFinancialContext,
    alreadyUsedQuestions: string[] = [],
  ): string {
    const { user, monthlySpending } = context;
    const income = user.monthlyIncome ?? 0;
    const used =
      alreadyUsedQuestions.length > 0
        ? ` Avoid: ${alreadyUsedQuestions.slice(0, 3).map((q) => q.substring(0, 30)).join('; ')}`
        : '';

    return `Quiz "${concept}". User spending $${monthlySpending}, income $${income}.${used}
Reply with ONLY raw JSON, no markdown and no \`\`\` code fences: {"title":"","description":"","questions":[{"question":"","options":["","","",""],"correctAnswer":0,"explanation":""}]} Exactly 5 questions, 4 options, correctAnswer 0-3.`;
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

      // Strip markdown first (handles truncated responses with no closing ```)
      let jsonStr = response.trim();
      jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, '').replace(/\s*```\s*$/, '').trim();

      // If still wrapped, try to extract from full block (when closing ``` exists)
      if (jsonStr.includes('```')) {
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonStr = jsonMatch[1].trim();
        } else {
          jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').split(/\s*```/)[0].trim();
        }
      }

      // Find JSON object if embedded in text
      if (!jsonStr.startsWith('{')) {
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        }
      }

      // Comprehensive JSON repair for truncated responses
      let parsed: any;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        const errMsg = parseError instanceof Error ? parseError.message : String(parseError);
        Logger.warn('JSON parse failed, attempting comprehensive repair', {
          concept,
          error: errMsg,
          jsonLength: jsonStr.length,
          lastChars: jsonStr.substring(Math.max(0, jsonStr.length - 300)),
        });
        
        let repairedJson = jsonStr.trim();
        
        // If error gives a position (e.g. "Unterminated string in JSON at position 234"), truncate there and close
        const positionMatch = errMsg.match(/position\s+(\d+)/i);
        if (positionMatch) {
          const pos = parseInt(positionMatch[1], 10);
          if (pos > 0 && pos <= repairedJson.length) {
            repairedJson = repairedJson.substring(0, pos) + '"';
          }
        } else {
          // Fallback: find last complete string and close any open string after it
          const stringMatches = [...repairedJson.matchAll(/"([^"\\]|\\.)*"/g)];
          let lastStringEnd = -1;
          if (stringMatches.length > 0) {
            const lastMatch = stringMatches[stringMatches.length - 1];
            lastStringEnd = lastMatch.index! + lastMatch[0].length;
          }
          if (lastStringEnd >= 0 && lastStringEnd < repairedJson.length) {
            const before = repairedJson.substring(0, lastStringEnd);
            const quoteCount = (before.match(/"/g) || []).length;
            if (quoteCount % 2 === 1) {
              repairedJson = repairedJson.substring(0, lastStringEnd) + '"' + repairedJson.substring(lastStringEnd);
            }
          }
        }
        
        // Close incomplete arrays
        const openBrackets = (repairedJson.match(/\[/g) || []).length;
        const closeBrackets = (repairedJson.match(/\]/g) || []).length;
        if (openBrackets > closeBrackets) {
          // Check if we need a comma before closing
          const lastChar = repairedJson.trim().slice(-1);
          if (lastChar !== '[' && lastChar !== ',' && lastChar !== '{') {
            repairedJson += ',';
          }
          repairedJson += ']'.repeat(openBrackets - closeBrackets);
        }
        
        // Close incomplete objects
        const openBraces = (repairedJson.match(/\{/g) || []).length;
        const closeBraces = (repairedJson.match(/\}/g) || []).length;
        if (openBraces > closeBraces) {
          // Check if we need a comma before closing
          const lastChar = repairedJson.trim().slice(-1);
          if (lastChar !== '{' && lastChar !== ',' && lastChar !== '[') {
            repairedJson += ',';
          }
          repairedJson += '}'.repeat(openBraces - closeBraces);
        }
        
        // Try parsing repaired JSON
        try {
          parsed = JSON.parse(repairedJson);
          Logger.info('Successfully repaired JSON', { concept });
        } catch (repairError) {
          // If repair fails, try to extract valid questions from partial JSON using regex
          Logger.warn('JSON repair failed, attempting partial extraction', {
            concept,
            repairError: repairError instanceof Error ? repairError.message : String(repairError),
          });
          
          // Extract questions using regex as last resort
          const questionRegex = /\{\s*"question"\s*:\s*"([^"]*(?:\\.[^"]*)*)"\s*,\s*"options"\s*:\s*\[([^\]]+)\]\s*,\s*"correctAnswer"\s*:\s*(\d+)\s*,\s*"explanation"\s*:\s*"([^"]*(?:\\.[^"]*)*)"\s*\}/g;
          const extractedQuestions: any[] = [];
          let match;
          
          while ((match = questionRegex.exec(jsonStr)) !== null && extractedQuestions.length < 5) {
            try {
              const optionsStr = match[2];
              const options = optionsStr.split(',').map((opt: string) => {
                const cleaned = opt.trim().replace(/^["']|["']$/g, '');
                return cleaned;
              }).filter((opt: string) => opt.length > 0);
              
              if (options.length === 4) {
                extractedQuestions.push({
                  question: match[1].replace(/\\"/g, '"'),
                  options: options,
                  correctAnswer: parseInt(match[3], 10),
                  explanation: match[4] ? match[4].replace(/\\"/g, '"') : 'No explanation provided.',
                });
              }
            } catch (e) {
              // Skip invalid matches
            }
          }
          
          if (extractedQuestions.length >= 3) {
            Logger.info(`Extracted ${extractedQuestions.length} questions from partial JSON`, { concept });
            parsed = {
              title: `Quiz: ${concept}`,
              description: `Test your knowledge about ${concept}`,
              questions: extractedQuestions,
            };
          } else {
            throw parseError; 
          }
        }
      }

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

      // Ensure we have at least 5 questions (but accept what we have if close)
      if (validQuestions.length < 3) {
        Logger.error('Not enough valid questions', {
          concept,
          validQuestions: validQuestions.length,
          totalQuestions: parsed.questions?.length || 0,
          required: 3,
        });
        throw new Error(`Only ${validQuestions.length} valid questions found, need at least 3`);
      }
      
      // If we have 3-4 questions, that's acceptable (better than failing)
      if (validQuestions.length < 5) {
        Logger.warn('Fewer than 5 questions, but proceeding', {
          concept,
          validQuestions: validQuestions.length,
        });
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
