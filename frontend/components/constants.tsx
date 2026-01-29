import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Target,
  Bot,
  Settings,
  Sprout
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    href: '/dashboard',
  },
  {
    id: 'grow',
    label: 'Grow',
    icon: <Sprout size={20} />,
    href: '/dashboard/grow',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: <Receipt size={20} />,
    href: '/dashboard/transactions',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <TrendingUp size={20} />,
    href: '/dashboard/analytics',
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: <Target size={20} />,
    href: '/dashboard/goals',
  },
  {
    id: 'ai-coach',
    label: 'AI Coach',
    icon: <Bot size={20} />,
    href: '/dashboard/ai-coach',
  },
 
];
