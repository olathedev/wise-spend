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
    <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-gray-50 rounded-xl">
          {icon}
        </div>
        {trend && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getTrendStyles()}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
