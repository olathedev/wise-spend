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
   * @param alreadyUsedQuestions - Question texts from other quizzes in this batch (avoid duplicates)
   */
  async generateQuizForConcept(
    concept: string,
    context: UserFinancialContext,
    alreadyUsedQuestions: string[] = [],
  ): Promise<Quiz> {
    const prompt = this.buildQuizGenerationPrompt(concept, context, alreadyUsedQuestions);
    
    try {
      // Generate with retry logic for truncated responses
      let response = '';
      let attempts = 0;
      const maxAttempts = 2;
      
      while (attempts < maxAttempts) {
        try {
          response = await this.aiService.generateText(prompt, {
            temperature: 0.55, // Higher for variety across quizzes; avoids repetitive outputs
            maxTokens: 2500,
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
    alreadyUsedQuestions: string[] = [],
  ): string {
    const { user, expenseSummary, monthlySpending } = context;
    const monthlyIncome = user.monthlyIncome;

    const bannedSection =
      alreadyUsedQuestions.length > 0
        ? `

ALREADY USED IN OTHER QUIZZES - DO NOT GENERATE ANYTHING SIMILAR:
${alreadyUsedQuestions.slice(0, 15).map((q) => `- "${q.substring(0, 80)}${q.length > 80 ? '...' : ''}"`).join('\n')}
Your 5 questions must be COMPLETELY DIFFERENT from all of the above.`
        : '';

    return `You are a financial education expert creating a personalized quiz for a user learning about "${concept}".${bannedSection}

USER PROFILE (KEEP REFERENCES SHORT):
- Name: ${user.name}
- Income: ${monthlyIncome ? `$${monthlyIncome.toLocaleString()}` : 'Not set'}
- Spending: $${monthlySpending.toLocaleString()}
- Goals: ${user.financialGoals?.slice(0, 2).join(', ') || 'None'}

CRITICAL - CONCEPT-SPECIFIC QUESTIONS ONLY:
Every question MUST test knowledge that is SPECIFIC to "${concept}" and ONLY that concept.
- For "Emergency Fund": ask about emergency fund rules, 3-6 months rule, where to keep it, when to use it, rebuilding after use
- For "Budgeting Basics" or "50/30/20 Rule": calculations and allocation rules are OK
- For "Debt Management": ask about debt payoff strategies, interest, snowball vs avalanche
- For "Investment Basics": ask about stocks, bonds, diversification, risk
- For "Credit Score": ask about factors, utilization, building credit
- For "Home Buying" or "Down Payment Planning": ask about down payment %, PMI, closing costs, pre-approval - NOT "how much can you save"
- For "Financial Goal Setting": ask about SMART goals, prioritization, milestones - NOT generic savings calculations
- For "Savings Strategies" or "Budgeting": savings calculations ARE appropriate
- DO NOT use generic savings questions like "how much could you save with income X and spending Y" unless the quiz is specifically about Budgeting or Savings
- DO NOT repeat the same question pattern across different concepts
- Each of the 5 questions must cover a DIFFERENT sub-topic within "${concept}"

TASK:
Create a personalized quiz about "${concept}" with EXACTLY 5 questions. The quiz should:
1. Test knowledge SPECIFIC to "${concept}" - each question must be about that concept
2. Cover 5 DIFFERENT aspects or sub-topics of "${concept}"
3. Reference user data ONLY when it fits naturally (e.g., for Emergency Fund: "With $X monthly expenses, how much should your emergency fund be?")
4. Vary question types: definitions, scenarios, best practices, rules - but ALL must be about "${concept}"
5. NEVER use generic "income minus spending = savings" style questions unless the concept is Budgeting/Savings

JSON FORMAT:
{
  "title": "Short title",
  "description": "Brief description",
  "questions": [
    {
      "question": "Short question (max 100 words)",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "explanation": "Brief explanation (max 50 words)"
    }
  ]
}

CRITICAL REQUIREMENTS:
- Generate EXACTLY 5 questions (no more, no less)
- Each question must have exactly 4 options
- correctAnswer must be a number: 0, 1, 2, or 3 (0-based index)
- Keep explanations under 50 words
- Keep questions under 100 words
- Keep options under 10 words each
- Return ONLY valid JSON - no markdown, no code blocks
- Ensure JSON is complete and properly closed

FORBIDDEN (never generate these):
- "How much could you potentially save each month towards your [goal]?" (generic - not concept-specific)
- "With income $X and spending $Y, how much can you save?" (unless concept is Budgeting/Savings)
- Any question that could appear in a quiz about a different concept
- Duplicate or near-duplicate question patterns

EXAMPLE - For "Emergency Fund" (concept-specific):
{
  "title": "Emergency Fund Quiz",
  "description": "Test your emergency fund knowledge",
  "questions": [
    {"question": "How many months of expenses should an emergency fund typically cover?", "options": ["1-2 months", "3-6 months", "12 months", "24 months"], "correctAnswer": 1, "explanation": "3-6 months covers most emergencies like job loss or medical bills."},
    {"question": "Where is the best place to keep an emergency fund?", "options": ["Stock market", "High-yield savings account", "Under mattress", "Cryptocurrency"], "correctAnswer": 1, "explanation": "Savings accounts are liquid and FDIC insured."}
  ]
}

REMEMBER: Every question must be about "${concept}" specifically. No generic savings questions.`;
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

      // Comprehensive JSON repair for truncated responses
      let parsed: any;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        Logger.warn('JSON parse failed, attempting comprehensive repair', {
          concept,
          error: parseError instanceof Error ? parseError.message : String(parseError),
          jsonLength: jsonStr.length,
          lastChars: jsonStr.substring(Math.max(0, jsonStr.length - 300)),
        });
        
        // Repair unterminated strings and incomplete structures
        let repairedJson = jsonStr.trim();
      
        const stringMatches = [...repairedJson.matchAll(/"([^"\\]|\\.)*"/g)];
        let lastStringEnd = -1;
        if (stringMatches.length > 0) {
          const lastMatch = stringMatches[stringMatches.length - 1];
          lastStringEnd = lastMatch.index! + lastMatch[0].length;
        }
        
        // If we're in the middle of a string, close it
        if (lastStringEnd < repairedJson.length) {
          // Check if we're inside quotes
          const afterLastString = repairedJson.substring(lastStringEnd);
          const openQuotes = (repairedJson.substring(0, lastStringEnd).match(/"/g) || []).length;
          const closeQuotes = (repairedJson.substring(0, lastStringEnd).match(/"/g) || []).length;
          
          // If we have an odd number of quotes, we're in an unterminated string
          if (openQuotes % 2 === 1) {
            // Find where the string started and close it
            let stringStart = lastStringEnd;
            for (let i = lastStringEnd - 1; i >= 0; i--) {
              if (repairedJson[i] === '"' && (i === 0 || repairedJson[i - 1] !== '\\')) {
                stringStart = i;
                break;
              }
            }
            // Close the string
            repairedJson = repairedJson.substring(0, lastStringEnd) + '"' + repairedJson.substring(lastStringEnd);
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
