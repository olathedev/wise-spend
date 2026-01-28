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
