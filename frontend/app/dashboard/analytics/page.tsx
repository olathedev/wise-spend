"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AnalyticsSummaryCards from "@/components/analytics/AnalyticsSummaryCards";
import {
  getAnalyticsHeatmap,
  getAnalyticsSummary,
  getAnalyticsBehavioral,
  type AnalyticsHeatmapDto,
  type AnalyticsSummaryDto,
  type AnalyticsBehavioralDto,
} from "@/services/analyticsService";

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AnalyticsPage() {
  const [heatmap, setHeatmap] = useState<AnalyticsHeatmapDto | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummaryDto | null>(null);
  const [behavioral, setBehavioral] = useState<AnalyticsBehavioralDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [heatmapRes, summaryRes, behavioralRes] = await Promise.all([
          getAnalyticsHeatmap(),
          getAnalyticsSummary(),
          getAnalyticsBehavioral(),
        ]);
        setHeatmap(heatmapRes);
        setSummary(summaryRes);
        setBehavioral(behavioralRes);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date().getDate();
  const daysInMonth = heatmap?.daysInMonth ?? 31;
  const maxAmount =
    heatmap?.days?.reduce((m, d) => Math.max(m, d.amount), 0) ?? 1;
  const maxCount =
    heatmap?.days?.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  const getIntensity = (dayData: { amount: number; count: number } | undefined): number => {
    if (!dayData || (dayData.amount === 0 && dayData.count === 0)) return 0;
    const amountNorm = maxAmount > 0 ? dayData.amount / maxAmount : 0;
    const countNorm = maxCount > 0 ? dayData.count / maxCount : 0;
    const combined = amountNorm * 0.6 + countNorm * 0.4;
    if (combined <= 0) return 0;
    if (combined <= 0.2) return 1;
    if (combined <= 0.4) return 2;
    if (combined <= 0.6) return 3;
    if (combined <= 0.8) return 4;
    return 5;
  };

  const getHeatmapColor = (intensity: number, day: number) => {
    if (day > today) {
      return "bg-slate-50 dark:bg-slate-800/20 opacity-30";
    }
    if (day === today) {
      return "border-2 border-primary border-dashed";
    }
    const colors = [
      "bg-teal-50 dark:bg-slate-800/50",
      "bg-teal-100",
      "bg-teal-200",
      "bg-teal-400",
      "bg-teal-600",
      "bg-teal-800",
    ];
    return colors[intensity] || colors[0];
  };

  const getHeatmapTextColor = (intensity: number, day: number) => {
    if (day > today) return "text-slate-400";
    if (day === today) return "text-primary";
    if (intensity >= 4) return "text-white/40";
    if (intensity >= 2) return "text-teal-900/40";
    return "text-slate-400/40";
  };

  const dayToData = React.useMemo(() => {
    const map: Record<number, { amount: number; count: number }> = {};
    heatmap?.days?.forEach((d) => {
      map[d.day] = { amount: d.amount, count: d.count };
    });
    return map;
  }, [heatmap]);

  const maxSpending =
    summary != null
      ? Math.max(summary.currentMonthSpending, summary.lastMonthSpending, 1)
      : 1;
  const currentPct =
    summary != null
      ? Math.round((summary.currentMonthSpending / maxSpending) * 100)
      : 0;
  const lastPct =
    summary != null
      ? Math.round((summary.lastMonthSpending / maxSpending) * 100)
      : 0;

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <div className="flex-1">
        <AnalyticsSummaryCards />
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        <div className="mb-8 px-1">
          <div className="bg-card-light dark:bg-card-dark p-4 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-black">
                  Spending Intensity Heatmap
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Transaction density across the current month (real data).
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Low
                  </span>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-teal-50 dark:bg-slate-800"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-teal-200"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-teal-400"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-teal-600"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-teal-800"></div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    High
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-bold text-slate-400 uppercase"
                >
                  {day}
                </div>
              ))}
              {loading
                ? Array.from({ length: 28 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800/50 animate-pulse"
                    />
                  ))
                : Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const data = dayToData[day];
                    const intensity = getIntensity(data);
                    return (
                      <div
                        key={day}
                        className={`aspect-square rounded-lg flex items-center justify-center text-[15px] font-bold ${getHeatmapColor(intensity, day)} ${getHeatmapTextColor(intensity, day)}`}
                      >
                        {day}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-4 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-black">
                  Current vs. Last Month Spending
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Total spending comparison (from your receipts).
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary"></span>
                  <span className="text-[10px] sm:text-xs font-medium text-slate-900 dark:text-primary">
                    This Month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span className="text-[10px] sm:text-xs font-medium text-slate-900 dark:text-black">
                    Last Month
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-5 sm:space-y-6">
              <div>
                <div className="flex justify-between text-[10px] sm:text-xs font-bold mb-2 text-slate-900 dark:text-black">
                  <span>Total Spending</span>
                  <div className="flex gap-2 sm:gap-3">
                    <span className="text-slate-400">
                      Last: {loading ? "…" : summary != null ? formatCurrency(summary.lastMonthSpending) : "—"}
                    </span>
                    <span className="text-primary">
                      Now: {loading ? "…" : summary != null ? formatCurrency(summary.currentMonthSpending) : "—"}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 sm:h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.max(currentPct, 8)}%`,
                    }}
                  />
                  <div
                    className="h-full bg-slate-200 dark:bg-slate-700 transition-all"
                    style={{
                      width: `${Math.max(lastPct, 8)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 text-white relative flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <span className="inline-block bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold text-teal-400 mb-4 uppercase tracking-widest">
                Behavioral Hub
              </span>
              <h4 className="text-xl font-bold mb-4 leading-snug">
                {loading
                  ? "Loading…"
                  : behavioral?.insight
                    ? `${behavioral.userName}, ${behavioral.insight}`
                    : "Add more receipts to unlock insights."}
              </h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {behavioral?.insight
                  ? "Patterns are based on your scanned receipts. Scan more to get personalized tips."
                  : "Once you have a few receipts, we’ll suggest habits and friction guards."}
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
