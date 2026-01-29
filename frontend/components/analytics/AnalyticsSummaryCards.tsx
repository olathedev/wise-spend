import React from 'react';
import SnapReceiptButton from '../receipt/SnapReceiptButton';

interface AnalyticsStatCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
}

const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  badgeColor,
  badgeBg,
}) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span className="material-icons-round">{icon}</span>
        </div>
        <span className={`text-xs font-bold ${badgeColor} ${badgeBg} px-2.5 py-1 rounded-full`}>
          {badge}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-black">{label}</p>
      <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-black">{value}</h3>
    </div>
  );
};

export default function AnalyticsSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <AnalyticsStatCard
        icon="bolt"
        iconBg="bg-orange-100 dark:bg-orange-900/40"
        iconColor="text-orange-600 dark:text-orange-400"
        label="Impulse Buy Frequency"
        value="8/month"
        badge="+12% vs last mo"
        badgeColor="text-red-600 dark:text-red-400"
        badgeBg="bg-red-50 dark:bg-red-900/20"
      />
      <AnalyticsStatCard
        icon="trending_up"
        iconBg="bg-teal-100 dark:bg-teal-900/40"
        iconColor="text-teal-600 dark:text-teal-400"
        label="Wise Score Trend"
        value="Rising"
        badge="+24 pts"
        badgeColor="text-teal-600 dark:text-teal-400"
        badgeBg="bg-teal-50 dark:bg-teal-900/20"
      />
      <AnalyticsStatCard
        icon="auto_renew"
        iconBg="bg-blue-100 dark:bg-blue-900/40"
        iconColor="text-blue-600 dark:text-blue-400"
        label="Subscription Efficiency"
        value="94%"
        badge="Optimal"
        badgeColor="text-blue-600 dark:text-blue-400"
        badgeBg="bg-blue-50 dark:bg-blue-900/20"
      />
      <SnapReceiptButton />
    </div>
  );
}
