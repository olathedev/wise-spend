"use client";

import React, { useMemo } from "react";
import { Goal } from "../types";
import { motion } from "framer-motion";

interface GoalsTimelineProps {
  goals: Goal[];
  monthlyIncome: number | null;
}

interface TimelineGoal extends Goal {
  monthsToComplete: number;
  completionDate: Date;
  monthlyContribution: number;
}

export default function GoalsTimeline({
  goals,
  monthlyIncome,
}: GoalsTimelineProps) {
  const timelineGoals = useMemo(() => {
    const now = new Date();
    const goalsWithTimeline: TimelineGoal[] = goals
      .filter((g) => g.targetAmount > 0)
      .map((goal) => {
        const remaining = goal.targetAmount - goal.currentAmount;
        // Estimate monthly contribution (assume equal distribution across goals)
        const totalMonthlySavings = monthlyIncome ? monthlyIncome * 0.2 : 1000; // 20% of income or default
        const monthlyContribution = totalMonthlySavings / Math.max(goals.length, 1);
        const monthsToComplete = Math.ceil(remaining / monthlyContribution);
        const completionDate = new Date(now);
        completionDate.setMonth(completionDate.getMonth() + monthsToComplete);

        return {
          ...goal,
          monthsToComplete,
          completionDate,
          monthlyContribution,
        };
      })
      .sort((a, b) => a.completionDate.getTime() - b.completionDate.getTime());

    return goalsWithTimeline;
  }, [goals, monthlyIncome]);

  if (timelineGoals.length === 0) {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-black mb-2">
          Goals Timeline
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Set targets for your goals to see them on the timeline.
        </p>
      </div>
    );
  }

  const maxMonths = Math.max(
    ...timelineGoals.map((g) => g.monthsToComplete),
    12
  );
  const timelineMonths = Array.from({ length: Math.min(maxMonths, 24) }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    return date;
  });

  const getGoalColor = (index: number) => {
    const colors = [
      "bg-teal-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-rose-500",
    ];
    return colors[index % colors.length];
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-black">
          Goals Timeline
        </h3>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {timelineGoals.length} active goal{timelineGoals.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="relative">
        {/* Timeline axis */}
        <div className="absolute left-0 right-0 top-8 h-0.5 bg-slate-200 dark:bg-slate-700" />

        {/* Goals */}
        <div className="relative space-y-8">
          {timelineGoals.map((goal, index) => {
            const position = (goal.monthsToComplete / maxMonths) * 100;
            const isVisible = goal.monthsToComplete <= 24;

            if (!isVisible) return null;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                style={{ paddingLeft: `${Math.min(position, 95)}%` }}
              >
                {/* Goal marker */}
                <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={`w-4 h-4 rounded-full ${getGoalColor(index)} border-2 border-white dark:border-slate-800 shadow-lg`}
                  />
                  <div
                    className={`absolute left-1/2 top-4 -translate-x-1/2 w-0.5 h-8 ${getGoalColor(index)} opacity-30`}
                  />
                </div>

                {/* Goal card */}
                <div className="ml-4 mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 min-w-[200px] max-w-[280px]">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-black">
                      {goal.name}
                    </h4>
                    <div
                      className={`w-2 h-2 rounded-full ${getGoalColor(index)} flex-shrink-0 mt-1 ml-2`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Progress
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-black">
                        {Math.round(
                          (goal.currentAmount / goal.targetAmount) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Target
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-black">
                        ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        ETA
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-black">
                        {formatMonth(goal.completionDate)}
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          Monthly
                        </span>
                        <span className="font-bold text-primary">
                          ${Math.round(goal.monthlyContribution).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Month markers */}
        <div className="mt-12 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
          {timelineMonths
            .filter((_, i) => i % 3 === 0)
            .map((date, i) => (
              <span key={i}>{formatMonth(date)}</span>
            ))}
        </div>
      </div>

      {timelineGoals.some((g) => g.monthsToComplete > 24) && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <strong>Note:</strong> Some goals extend beyond 24 months. Consider
            increasing your monthly contributions to accelerate progress.
          </p>
        </div>
      )}
    </div>
  );
}
