import React from 'react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, trendType }) => {
  const getTrendStyles = () => {
    switch (trendType) {
      case 'positive': return 'bg-emerald-50 text-emerald-600';
      case 'negative': return 'bg-red-50 text-red-500';
      default: return 'bg-teal-50 text-teal-600';
    }
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-gray-50 rounded-xl">
          {icon}
        </div>
        {trend && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getTrendStyles()}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
