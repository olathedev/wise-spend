export type AppView = 
  | 'dashboard'
  | 'transactions'
  | 'analytics'
  | 'goals'
  | 'grow'
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

export interface Transaction {
  id: string;
  date: string;
  vendor: string;
  icon: string;
  category: Category;
  status: 'AI Verified' | 'Pending' | 'Manual';
  amount: number;
}

export interface Insight {
  tip: string;
  potentialSavings: string;
}
