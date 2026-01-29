import React from 'react';
import { Shield, ShoppingBag, Verified } from 'lucide-react';
import StatCard from './StatCard';

export default function FinancialSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<Shield size={24} className="text-teal-600" />}
        label="Emergency Fund"
        value="$12,450.00"
        trend="+4.2%"
        trendType="positive"
      />
      <StatCard
        icon={<ShoppingBag size={24} className="text-blue-600" />}
        label="Monthly Spending"
        value="$2,180.40"
        trend="82% of budget"
        trendType="neutral"
      />
      <StatCard
        icon={<Verified size={24} className="text-teal-600" />}
        label="Wise Score"
        value="842"
        trend="Top 5%"
        trendType="positive"
      />
      <button className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-teal-200 dark:border-teal-900/50 bg-teal-50/30 dark:bg-teal-900/10 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
          <span className="material-icons-round text-3xl">add</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-teal-700 dark:text-teal-400">Snap Receipt</p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-teal-600/60 dark:text-teal-400/60">Add New Expense</p>
        </div>
      </button>
    </div>
  );
}
