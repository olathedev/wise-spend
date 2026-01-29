import { Transaction, Insight } from '../../types';

// Placeholder service for Gemini AI insights
// Replace with actual Gemini API integration when ready
export const getFinancialInsight = async (transactions: Transaction[]): Promise<Insight> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock insight based on transactions
  const totalSpending = Math.abs(
    transactions.reduce((sum, t) => sum + (t.amount < 0 ? t.amount : 0), 0)
  );
  
  const lifestyleSpending = transactions
    .filter(t => t.category === 'Lifestyle' && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const potentialSavings = lifestyleSpending * 0.2; // Assume 20% savings potential
  
  return {
    tip: lifestyleSpending > 50 
      ? "Consider reducing lifestyle expenses by 20% to accelerate your savings goals."
      : "Your spending patterns look healthy. Keep tracking to maintain financial wellness.",
    potentialSavings: `$${potentialSavings.toFixed(2)}/yr`,
  };
};

// Generate Socratic insight for a single transaction
export const generateSocraticInsight = async (transaction: Transaction): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock insight based on transaction
  const hasLuxuryItems = transaction.items?.some(item => item.type === 'LUXURY') || transaction.category === 'Lifestyle';
  const total = transaction.total || Math.abs(transaction.amount);
  
  if (hasLuxuryItems && total > 20) {
    return `This ${total > 50 ? 'larger' : 'moderate'} purchase includes luxury items. Consider if these align with your financial goals. Redirecting this amount to savings could accelerate your progress by approximately ${Math.ceil(total / 50)} weeks.`;
  } else if (transaction.category === 'Essentials') {
    return `This essential purchase supports your daily needs. Your spending on necessities is well-balanced. Continue tracking to maintain this healthy pattern.`;
  } else {
    return `This transaction has been categorized and verified. Review your spending patterns regularly to ensure alignment with your financial objectives.`;
  }
};

// Generate financial advice for goals
export const getFinancialAdvice = async (goals: any[]): Promise<string | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock advice based on goals
  const totalProgress = goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / goals.length * 100;
  
  if (totalProgress < 50) {
    return 'I noticed you have $120 surplus in your \'Dining Out\' budget this month. If you reallocated this to your \'Emergency Fund\', you could reach your target 2 weeks earlier. Shall we adjust your contribution plan?';
  } else {
    return 'Great progress on your goals! Consider increasing your monthly contributions by 10% to accelerate your timeline. This could help you reach your Emergency Fund goal even sooner.';
  }
};

// Generate Socratic tip for goal setup
export const getSocraticTip = async (goalData: any): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock tip based on goal data
  const monthsToGoal = goalData.targetAmount / goalData.monthlyContribution;
  
  if (goalData.aiCoachEnabled) {
    if (monthsToGoal > 24) {
      return 'I\'ll look for minor surpluses in your \'Dining\' and \'Leisure\' categories. Redirecting $200/month could shorten your timeline by 3 months.';
    } else if (monthsToGoal > 12) {
      return 'I\'ll analyze your spending patterns to find optimization opportunities. Small adjustments could accelerate your goal by 15-20%.';
    } else {
      return 'You\'re on a great track! I\'ll monitor your budget to ensure you stay on course and suggest any final optimizations.';
    }
  }
  
  return 'Enable AI Coach to get personalized optimization suggestions for this goal.';
};

// Stream coaching responses
export async function* streamCoaching(messages: any[], userInput: string): AsyncGenerator<string> {
  // Simulate streaming response
  const mockResponse = `I see what you mean. Reducing to twice a week is a great compromise. That would save you approximately $832 per year while still maintaining your ritual. Let's think about this: what if we redirected half of those savings—about $416—directly to your 'Home Downpayment' goal? You'd still have the comfort of your ritual, but you'd also be making meaningful progress toward homeownership. Does that balance feel right to you?`;
  
  // Simulate streaming by yielding chunks
  const words = mockResponse.split(' ');
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    yield (i === 0 ? words[i] : ' ' + words[i]);
  }
}
