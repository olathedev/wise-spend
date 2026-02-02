"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import GoalCard from "@/components/goals/GoalCard";
import SummaryCard from "@/components/goals/SummaryCard";
import AddGoalModal from "@/components/goals/AddGoalModal";
import { getFinancialAdvice } from "@/components/transactions/services/geminiService";
import {
  financialGoalsToGoals,
  defaultSummaryStats,
} from "@/components/goals/constants";
import { getCurrentUser, updateProfile } from "@/services/authService";
import { Goal, SummaryStats } from "@/components/types";

export default function GoalsPage() {
  const [goalIds, setGoalIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<string>(
    "Add goals and track spending to get personalized suggestions."
  );
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  const goals = financialGoalsToGoals(goalIds);
  const stats: SummaryStats = defaultSummaryStats(goals.length);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await getCurrentUser();
        setGoalIds(user.financialGoals ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load goals");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (goals.length === 0) return;
    const fetchAdvice = async () => {
      setIsAdviceLoading(true);
      const advice = await getFinancialAdvice(goals);
      if (advice) setSuggestion(advice);
      setIsAdviceLoading(false);
    };
    fetchAdvice();
  }, [goals]);

  const handleAddGoals = async (newIds: string[]) => {
    const updated = [...goalIds, ...newIds].slice(0, 5);
    await updateProfile({ financialGoals: updated });
    setGoalIds(updated);
  };

  const handleApplySuggestion = () => {
    alert("Suggestion applied! Your contribution plan has been updated.");
  };

  return (
    <>
      <Header />

      <div className="mb-8 px-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
          Financial Goals
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Track your progress and reach your milestones faster.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <SummaryCard
          title="Total Progress"
          value={loading ? "…" : `${stats.totalProgress}%`}
          subtitle={`+${stats.monthlyProgressChange}% this month`}
          icon="donut_large"
          color="teal"
          showProgress
          progress={stats.totalProgress}
        />
        <SummaryCard
          title="Next Milestone"
          value={loading ? "…" : stats.nextMilestone}
          subtitle={`Expected: ${stats.milestoneDate}`}
          icon="flag"
          color="blue"
        />
        <div className="sm:col-span-2 lg:col-span-1">
          <SummaryCard
            title="Monthly Contribution"
            value={
              loading ? "…" : `$${stats.monthlyContribution.toLocaleString()}.00`
            }
            subtitle={`Across ${stats.activeGoalsCount} active goals`}
            icon="payments"
            color="orange"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {loading ? (
              <div className="col-span-2 py-12 text-center text-slate-500">
                Loading goals…
              </div>
            ) : (
              <>
                {goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={goalIds.length >= 5}
                  className="bg-transparent p-4 sm:p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group min-h-[160px] sm:min-h-[220px] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-icons-round text-xl sm:text-2xl">
                      add
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {goalIds.length >= 5
                        ? "Max 5 goals"
                        : "Create New Goal"}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {goalIds.length >= 5
                        ? "Remove one to add another"
                        : "Add from your goal list"}
                    </p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Suggestion */}
        <div className="w-full lg:w-80">
          <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 sm:p-6 sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">
                auto_awesome
              </span>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                Socratic Suggestion
              </h4>
            </div>

            <div
              className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 mb-6 transition-opacity ${isAdviceLoading ? "opacity-50" : "opacity-100"}`}
            >
              <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                &ldquo;{suggestion}&rdquo;
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleApplySuggestion}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 hover:opacity-90 transition-opacity"
              >
                Apply Suggestion
              </button>
              <button className="w-full py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Dismiss
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Optimization Progress
              </h5>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-1000"
                    style={{
                      width: `${goals.length > 0 ? Math.min(100, goals.length * 25) : 0}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {goals.length > 0 ? Math.min(100, goals.length * 25) : 0}%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                {goals.length} goal{goals.length !== 1 ? "s" : ""} set. Set
                targets to track progress.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-8" />

      {isAddModalOpen && (
        <AddGoalModal
          currentGoalIds={goalIds}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddGoals}
        />
      )}
    </>
  );
}
