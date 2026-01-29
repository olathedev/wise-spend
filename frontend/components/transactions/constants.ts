import { Transaction, Category } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: 'May 12, 2024',
    vendor: 'Whole Foods Market',
    icon: 'shopping_bag',
    category: 'Essentials',
    status: 'AI Verified',
    amount: -142.30,
  },
  {
    id: '2',
    date: 'May 11, 2024',
    vendor: 'Netflix Subscription',
    icon: 'movie',
    category: 'Lifestyle',
    status: 'AI Verified',
    amount: -18.99,
  },
  {
    id: '3',
    date: 'May 10, 2024',
    vendor: 'Utility Corp',
    icon: 'electric_bolt',
    category: 'Bills',
    status: 'AI Verified',
    amount: -85.00,
  },
  {
    id: '4',
    date: 'May 09, 2024',
    vendor: 'Uber Rides',
    icon: 'directions_car',
    category: 'Lifestyle',
    status: 'AI Verified',
    amount: -24.50,
  },
  {
    id: '5',
    date: 'May 08, 2024',
    vendor: "Joe's Coffee House",
    icon: 'restaurant',
    category: 'Lifestyle',
    status: 'AI Verified',
    amount: -6.50,
  },
];

export const CATEGORIES: { name: string; value: Category }[] = [
  { name: 'All', value: 'All' },
  { name: 'Essentials', value: 'Essentials' },
  { name: 'Lifestyle', value: 'Lifestyle' },
  { name: 'Bills', value: 'Bills' },
];
