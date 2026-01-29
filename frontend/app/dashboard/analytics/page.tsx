'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import AnalyticsSummaryCards from '@/components/analytics/AnalyticsSummaryCards';

export default function AnalyticsPage() {
  // Heatmap data - intensity levels for each day (1-28)
  // Intensity: 0 = none, 1 = low, 2 = medium-low, 3 = medium, 4 = medium-high, 5 = high
  const heatmapData = [
    1, 0, 3, 0, 4, 5, 2, // Days 1-7
    0, 1, 0, 2, 4, 0, 0, // Days 8-14
    0, 0, 1, 3, 5, 0, 0, // Days 15-21
    0, 1, 2, 0, 0, 0, 0, // Days 22-28
  ];

  const getHeatmapColor = (intensity: number, day: number) => {
    if (day > 21) {
      return 'bg-slate-50 dark:bg-slate-800/20 opacity-30';
    }
    if (day === 22) {
      return 'border-2 border-primary border-dashed';
    }
    const colors = [
      'bg-teal-50 dark:bg-slate-800/50',
      'bg-teal-100',
      'bg-teal-200',
      'bg-teal-400',
      'bg-teal-600',
      'bg-teal-800',
    ];
    return colors[intensity] || colors[0];
  };

  const getHeatmapTextColor = (intensity: number, day: number) => {
    if (day > 21) return 'text-slate-400';
    if (day === 22) return 'text-primary';
    if (intensity >= 4) return 'text-white/40';
    if (intensity >= 2) return 'text-teal-900/40';
    return 'text-slate-400/40';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Summary Cards */}
        <AnalyticsSummaryCards />

        {/* Heatmap Section */}
        <div className="mb-8">
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-black">Spending Intensity Heatmap</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Visualizing transaction density across the current month.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Low</span>
                  <div className="w-3 h-3 rounded-sm bg-teal-50 dark:bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-sm bg-teal-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-teal-400"></div>
                  <div className="w-3 h-3 rounded-sm bg-teal-600"></div>
                  <div className="w-3 h-3 rounded-sm bg-teal-800"></div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">High</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {/* Day headers */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase">
                  {day}
                </div>
              ))}
              {/* Heatmap cells */}
              {heatmapData.map((intensity, index) => {
                const day = index + 1;
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[15px] text-black dark:text-black font-bold ${getHeatmapColor(intensity, day)} ${getHeatmapTextColor(intensity, day)}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-black">Current vs. Last Month Spending</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Year-over-year growth and category comparison.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-xs font-medium text-slate-900 dark:text-primary">This Month</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span className="text-xs font-medium text-slate-900 dark:text-black">Last Month</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* Food & Dining */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 text-slate-900 dark:text-white">
                  <span>Food & Dining</span>
                  <div className="flex gap-3">
                    <span className="text-slate-400">Last: $420</span>
                    <span className="text-primary">Now: $385</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                  <div className="h-full bg-slate-200 dark:bg-slate-700" style={{ width: '50%' }}></div>
                </div>
              </div>
              {/* Entertainment */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 text-slate-900 dark:text-white">
                  <span>Entertainment</span>
                  <div className="flex gap-3">
                    <span className="text-slate-400">Last: $150</span>
                    <span className="text-primary">Now: $210</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                  <div className="h-full bg-slate-200 dark:bg-slate-700" style={{ width: '35%' }}></div>
                </div>
              </div>
              {/* Transport */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 text-slate-900 dark:text-white">
                  <span>Transport</span>
                  <div className="flex gap-3">
                    <span className="text-slate-400">Last: $280</span>
                    <span className="text-primary">Now: $265</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                  <div className="h-full bg-slate-200 dark:bg-slate-700" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Behavioral Hub Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <span className="inline-block bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold text-teal-400 mb-4 uppercase tracking-widest">
                Behavioral Hub
              </span>
              <h4 className="text-xl font-bold mb-4 leading-snug">
                Daniel, your impulse buying usually peaks on Fridays after 6 PM.
              </h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                I&apos;ve detected a pattern: &ldquo;End-of-week reward&rdquo; spending. Try setting a 24-hour cooling-off period for any cart items above $50 this weekend.
              </p>
            </div>
            <button className="relative z-10 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-teal-600 transition-colors flex items-center justify-center gap-2">
              Set Friction Guard
              <span className="material-icons-round text-sm">security</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
