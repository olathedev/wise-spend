'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const chartData = [
  { name: 'MAR', value: 40, isProjection: false },
  { name: 'APR', value: 60, isProjection: false },
  { name: 'MAY', value: 55, isProjection: false, isNow: true },
  { name: 'JUN', value: 65, isProjection: true },
  { name: 'JUL', value: 75, isProjection: true },
];

const InsightCards: React.FC = () => {
  return (
    <div className="w-80 flex flex-col gap-6 h-full overflow-y-auto pr-1">
      {/* Current Insight Card */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
        <div className="relative z-10">
          <span className="inline-block bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold mb-3 uppercase tracking-wider">
            Current Insight
          </span>
          <h4 className="text-lg font-bold mb-3 leading-tight">Retirement vs. Ritual</h4>
          <p className="text-teal-50 text-xs opacity-90 leading-relaxed mb-4">
            Reducing coffee spend from daily to twice weekly saves <strong className="text-white">$1,248/year</strong>.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+1.2% WISE SCORE POTENTIAL</span>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 opacity-10">
          <span className="material-symbols-outlined text-6xl">psychology</span>
        </div>
      </div>

      {/* Resilience Impact Visualization */}
      <div className="flex-1 bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[320px]">
        <h4 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">Resilience Impact</h4>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest font-bold">
          Scenario: Coffee Reduction
        </p>
        
        <div className="flex-1 w-full min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 8, fontWeight: 700, fill: '#94a3b8' }} 
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isNow ? '#14b8a6' : (entry.isProjection ? '#ccfbf1' : '#f1f5f9')}
                    stroke={entry.isProjection ? '#14b8a6' : 'none'}
                    strokeDasharray={entry.isProjection ? '3 3' : '0'}
                    className="dark:fill-slate-800"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Projection</span>
            <span className="text-xs font-bold text-teal-500 dark:text-teal-400">+2 Months Early</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[75%] rounded-full transition-all duration-1000" />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group shrink-0">
        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
          auto_fix_high
        </span>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-700 dark:group-hover:text-slate-300">
          Apply Budget Change
        </span>
      </button>
    </div>
  );
};

export default InsightCards;
