import { Goal, SummaryStats } from '../types';

export const INITIAL_GOALS: Goal[] = [
  { 
    id: '1', 
    name: 'Emergency Fund', 
    description: 'Safety net for 6 months', 
    currentAmount: 12750, 
    targetAmount: 15000, 
    aiStatus: 'REACHED BY OCT' 
  },
  { 
    id: '2', 
    name: 'New SUV', 
    description: 'Down payment for Tesla', 
    currentAmount: 8000, 
    targetAmount: 20000, 
    aiStatus: 'JAN 2025' 
  },
  { 
    id: '3', 
    name: 'Europe Summer Trip', 
    description: 'Flights and hotels for 2 weeks', 
    currentAmount: 3000, 
    targetAmount: 5000, 
    aiStatus: 'ON TRACK' 
  },
];

export const INITIAL_STATS: SummaryStats = {
  totalProgress: 68,
  monthlyProgressChange: 4,
  nextMilestone: 'Emergency Fund',
  milestoneDate: 'Nov 2024',
  monthlyContribution: 1450,
  activeGoalsCount: 5,
};
