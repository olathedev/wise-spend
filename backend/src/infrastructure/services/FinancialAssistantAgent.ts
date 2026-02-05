import { User } from '@domain/entities/User';
import { Expense } from '@domain/entities/Expense';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IExpenseRepository } from '@domain/repositories/IExpenseRepository';
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
 * Financial Assistant Agent
 * Builds comprehensive user context for personalized Socratic coaching
 */
export class FinancialAssistantAgent {
  constructor(
    private userRepository: IUserRepository,
    private expenseRepository: IExpenseRepository,
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
    
    // Categorize expenses (simple keyword-based for now)
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
      recentExpenses: expenses.slice(0, 20), // Last 20 expenses
      monthlySpending,
      expenseSummary,
    };
  }

  /**
   * Build system prompt with user context for Socratic coaching
   */
  buildSystemPrompt(context: UserFinancialContext): string {
    const { user, recentExpenses, monthlySpending, expenseSummary } = context;
    
    const coachStyle = user.coachPersonality || 'balanced';
    const coachStyleDescription = this.getCoachStyleDescription(coachStyle);
    
    // Build goals summary
    const goalsSummary = this.buildGoalsSummary(user);
    
    // Build spending insights
    const spendingInsights = this.buildSpendingInsights(expenseSummary, monthlySpending, user.monthlyIncome);
    
    // Build recent transactions summary
    const recentTransactionsSummary = this.buildRecentTransactionsSummary(recentExpenses);
    
    return `You are a Socratic financial coach named Wise Coach. Your role is to help users discover their own financial insights through thoughtful questions, not commands.

${coachStyleDescription}

USER CONTEXT:
- Name: ${user.name}
- Monthly Income: ${user.monthlyIncome ? `$${user.monthlyIncome.toLocaleString()}` : 'Not set'}
- Wise Score: ${user.wiseScore !== undefined ? `${user.wiseScore}/1000 (${user.wiseScoreTier || 'N/A'})` : 'Not calculated yet'}

${goalsSummary}

${spendingInsights}

${recentTransactionsSummary}

SOCRATIC COACHING PRINCIPLES:
1. Ask questions that help users discover insights themselves
2. Reference their actual data (spending, goals, income) in your questions
3. Use their coach personality style (${coachStyle})
4. Be supportive but firm - don't sugarcoat reality
5. Help them see trade-offs: "Is that $X purchase worth Y weeks further from your goal?"
6. When they ask about their account, provide specific data from their transactions
7. Use their name naturally in conversation
8. Reference specific transactions when relevant

CAPABILITIES:
- Answer questions about their spending patterns
- Explain their Wise Score and what it means
- Discuss their financial goals and progress
- Provide insights about their transaction history
- Help them understand the impact of purchases on their goals
- Suggest actionable steps based on their data

RESPONSE STYLE:
- Use Socratic questioning: "Have you noticed..." instead of "You should..."
- Reference specific amounts and goals: "That $50 purchase is 2% of your monthly income"
- Be conversational but data-driven
- When asked about account info, provide specific numbers from their data
- Keep responses concise but insightful (2-3 sentences for questions, longer for explanations)

Remember: You're helping them build awareness, not just tracking expenses. Every interaction should move them toward better financial decisions.`;
  }

  private getCoachStyleDescription(style: string): string {
    const styles: Record<string, string> = {
      drill_sergeant: 'You are direct and no-nonsense. Challenge users firmly but fairly. Use strong language when needed.',
      cheerleader: 'You are encouraging and positive. Celebrate wins and motivate through optimism.',
      analyst: 'You are data-focused and analytical. Present facts and let users draw conclusions.',
      balanced: 'You balance support with accountability. Ask probing questions while remaining empathetic.',
    };
    
    return styles[style] || styles.balanced;
  }

  private buildGoalsSummary(user: User): string {
    if (!user.financialGoals || user.financialGoals.length === 0) {
      return 'GOALS: No financial goals set yet.';
    }

    let summary = 'GOALS:\n';
    user.financialGoals.forEach((goalId, index) => {
      const target = user.goalTargets?.[goalId];
      const deadline = user.goalDeadlines?.[goalId];
      const isPrimary = user.primaryGoalId === goalId;
      
      summary += `- ${goalId}${isPrimary ? ' (PRIMARY)' : ''}`;
      if (target) summary += ` - Target: $${target.toLocaleString()}`;
      if (deadline) summary += ` - Deadline: ${deadline}`;
      summary += '\n';
    });

    return summary;
  }

  private buildSpendingInsights(
    expenseSummary: UserFinancialContext['expenseSummary'],
    monthlySpending: number,
    monthlyIncome?: number,
  ): string {
    let insights = `SPENDING THIS MONTH:\n`;
    insights += `- Total: $${monthlySpending.toLocaleString()}\n`;
    insights += `- Transactions: ${expenseSummary.count}\n`;
    insights += `- Average per transaction: $${expenseSummary.averagePerTransaction.toFixed(2)}\n`;
    
    if (monthlyIncome) {
      const spendingPercentage = (monthlySpending / monthlyIncome) * 100;
      insights += `- Spending as % of income: ${spendingPercentage.toFixed(1)}%\n`;
      
      if (spendingPercentage > 80) {
        insights += `⚠️ WARNING: Spending is ${spendingPercentage.toFixed(1)}% of income - very high!\n`;
      } else if (spendingPercentage > 60) {
        insights += `⚠️ CAUTION: Spending is ${spendingPercentage.toFixed(1)}% of income - consider reducing\n`;
      }
    }
    
    if (Object.keys(expenseSummary.categories).length > 0) {
      insights += `\nTOP SPENDING CATEGORIES:\n`;
      const sortedCategories = Object.entries(expenseSummary.categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
      
      sortedCategories.forEach(([category, amount]) => {
        insights += `- ${category}: $${amount.toFixed(2)}\n`;
      });
    }

    return insights;
  }

  private buildRecentTransactionsSummary(expenses: Expense[]): string {
    if (expenses.length === 0) {
      return 'RECENT TRANSACTIONS: No transactions recorded yet.';
    }

    let summary = `RECENT TRANSACTIONS (Last ${Math.min(expenses.length, 10)}):\n`;
    expenses.slice(0, 10).forEach((expense, index) => {
      const amount = parseAmountFromTitle(expense.title);
      const date = expense.createdAt 
        ? new Date(expense.createdAt).toLocaleDateString()
        : 'Recent';
      
      summary += `${index + 1}. ${expense.title} - $${Math.abs(amount).toFixed(2)} (${date})\n`;
      if (expense.aiDescription) {
        summary += `   Note: ${expense.aiDescription.substring(0, 100)}\n`;
      }
    });

    return summary;
  }
}
