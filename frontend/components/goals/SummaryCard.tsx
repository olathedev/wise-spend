import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: 'teal' | 'blue' | 'orange';
  showProgress?: boolean;
  progress?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  showProgress = false,
  progress = 0 
}) => {
  const colorClasses = {
    teal: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
    blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <span className="material-icons-round">{icon}</span>
        </div>
        {showProgress && (
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2.5 py-1 rounded-full">
            +{subtitle.match(/\d+/)?.[0] || 0}% this month
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-black mb-1">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-black">{value}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>
      {showProgress && (
        <div className="mt-4">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
