"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, BookOpen } from "lucide-react";
import { getDailyAssessmentStatus } from "@/services/dailyAssessmentService";

export default function AssessmentStreakCard() {
  const [status, setStatus] = useState<{
    streak: number;
    totalCompleted: number;
    completedDates: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDailyAssessmentStatus();
        setStatus({
          streak: data.streak,
          totalCompleted: data.totalCompleted,
          completedDates: data.completedDates,
        });
      } catch {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completedSet = new Set(status?.completedDates ?? []);
  const today = new Date().toISOString().slice(0, 10);

  // Last 7 days for the heatmap
  const days: { date: string; isCompleted: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push({
      date: dateStr,
      isCompleted: completedSet.has(dateStr),
    });
  }

  if (loading) {
    return (
      <div className="slick-glass p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse">
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="slick-glass p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <Flame
              size={24}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-black">
              Quiz Streak
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily financial literacy
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {status?.streak ?? 0}
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            days
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <BookOpen size={16} />
          <span>
            <strong className="text-slate-900 dark:text-white">
              {status?.totalCompleted ?? 0}
            </strong>{" "}
            quizzes completed
          </span>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Last 7 days
        </p>
        <div className="grid grid-cols-7 gap-2">
          {days.map(({ date, isCompleted }) => {
            const isToday = date === today;
            return (
              <div
                key={date}
                title={`${date}${isCompleted ? " ✓" : ""}`}
                className={`aspect-square rounded-md flex items-center justify-center ${
                  isCompleted
                    ? "bg-amber-500 dark:bg-amber-600"
                    : "bg-slate-100 dark:bg-slate-800/50"
                } ${isToday ? "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900" : ""}`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="w-3 h-3 rounded bg-amber-300" />
            <div className="w-3 h-3 rounded bg-amber-500" />
          </div>
          <span>More</span>
        </div>
      </div>
    </motion.div>
  );
}
