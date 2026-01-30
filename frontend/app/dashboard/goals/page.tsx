"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import GoalCard from "@/components/goals/GoalCard";
import SummaryCard from "@/components/goals/SummaryCard";
import GoalSetupModal from "@/components/goals/GoalSetupModal";
import { getFinancialAdvice } from "@/components/transactions/services/geminiService";
import { INITIAL_GOALS, INITIAL_STATS } from "@/components/goals/constants";
import { Goal, SummaryStats, GoalData } from "@/components/types";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [stats] = useState<SummaryStats>(INITIAL_STATS);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<string>(
    "I noticed you have $120 surplus in your 'Dining Out' budget this month. If you reallocated this to your 'Emergency Fund', you could reach your target 2 weeks earlier. Shall we adjust your contribution plan?",
  );
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsAdviceLoading(true);
      const advice = await getFinancialAdvice(goals);
      if (advice) setSuggestion(advice);
      setIsAdviceLoading(false);
    };

    // Initial advice
    fetchAdvice();
  }, [goals]);

  const handleApplySuggestion = () => {
    // Mock interaction
    alert("Suggestion applied! Your contribution plan has been updated.");
  };

  const handleCreateGoal = (goalData: GoalData) => {
    // Convert GoalData to Goal format
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalData.name,
      description: `Target: $${goalData.targetAmount.toLocaleString()}`,
      currentAmount: 0,
      targetAmount: goalData.targetAmount,
      aiStatus: goalData.aiCoachEnabled ? "ON TRACK" : "MANUAL",
    };
    setGoals([...goals, newGoal]);
    setIsGoalModalOpen(false);
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

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <SummaryCard
          title="Total Progress"
          value={`${stats.totalProgress}%`}
          subtitle={`+${stats.monthlyProgressChange}% this month`}
          icon="donut_large"
          color="teal"
          showProgress
          progress={stats.totalProgress}
        />
        <SummaryCard
          title="Next Milestone"
          value={stats.nextMilestone}
          subtitle={`Expected: ${stats.milestoneDate}`}
          icon="flag"
          color="blue"
        />
        <div className="sm:col-span-2 lg:col-span-1">
          <SummaryCard
            title="Monthly Contribution"
            value={`$${stats.monthlyContribution.toLocaleString()}.00`}
            subtitle={`Across ${stats.activeGoalsCount} active goals`}
            icon="payments"
            color="orange"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}

            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="bg-transparent p-4 sm:p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group min-h-[160px] sm:min-h-[220px]"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-icons-round text-xl sm:text-2xl">
                  add
                </span>
              </div>
              <div className="text-center">
                <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Create New Goal
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Set a new financial target
                </p>
              </div>
            </button>
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
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  75%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                You&apos;re following 3 out of 4 AI recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-8"></div>

      {isGoalModalOpen && (
        <GoalSetupModal
          onClose={() => setIsGoalModalOpen(false)}
          onCreate={handleCreateGoal}
        />
      )}
    </>
  );
}
