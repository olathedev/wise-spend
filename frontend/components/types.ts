export type AppView = 
  | 'dashboard'
  | 'transactions'
  | 'analytics'
  | 'goals'
  | 'ai-coach'
  | 'settings';

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export type Category = 'Essentials' | 'Lifestyle' | 'Bills' | 'All';

export interface TransactionItem {
  name: string;
  price: number;
  type: 'ESSENTIAL' | 'LUXURY';
}

export interface Transaction {
  id: string;
  date: string;
  vendor: string;
  icon: string;
  category: Category;
  status: 'AI Verified' | 'Pending' | 'Manual';
  amount: number;
  // Extended fields for receipt modal
  address?: string;
  time?: string;
  total?: number;
  items?: TransactionItem[];
}

export interface Insight {
  tip: string;
  potentialSavings: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  aiStatus: string;
}

export interface SummaryStats {
  totalProgress: number;
  monthlyProgressChange: number;
  nextMilestone: string;
  milestoneDate: string;
  monthlyContribution: number;
  activeGoalsCount: number;
}
