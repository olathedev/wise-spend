"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Goal } from "../types";
import { getExpenses, ExpenseDto } from "@/services/receiptService";
import { parseAmountFromTitle } from "@/lib/expenseToTransaction";

interface SacrificeOption {
  id: string;
  name: string;
  icon: string;
  monthlyAmount: number;
  impact: {
    monthsSaved: number;
    goalId: string;
    goalName: string;
  }[];
  category: "coffee" | "dining" | "entertainment" | "shopping" | "subscription";
}

interface SacrificeScoreProps {
  goals: Goal[];
  monthlyIncome: number | null;
}

export default function SacrificeScore({
  goals,
  monthlyIncome,
}: SacrificeScoreProps) {
  const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Failed to load expenses:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, []);

  const sacrificeOptions = useMemo(() => {
    if (!monthlyIncome || goals.length === 0) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Analyze expenses to find recurring patterns
    const monthlyExpenses = expenses.filter((exp) => {
      const date = new Date(exp.createdAt);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    // Calculate average spending by category/merchant
    const merchantSpending: Record<string, { total: number; count: number }> =
      {};
    monthlyExpenses.forEach((exp) => {
      const amount = parseAmountFromTitle(exp.title, exp.aiDescription);
      const merchant = exp.title.split(" - ")[0] || "Unknown";
      if (!merchantSpending[merchant]) {
        merchantSpending[merchant] = { total: 0, count: 0 };
      }
      merchantSpending[merchant].total += amount;
      merchantSpending[merchant].count += 1;
    });

    // Identify potential sacrifices (recurring expenses that could be reduced)
    const options: SacrificeOption[] = [];
    const goalsWithTargets = goals.filter((g) => g.targetAmount > 0);

    if (goalsWithTargets.length === 0) return [];

    // Estimate monthly savings allocation
    const totalMonthlySavings = monthlyIncome * 0.2; // 20% of income
    const monthlyContributionPerGoal =
      totalMonthlySavings / goalsWithTargets.length;

    Object.entries(merchantSpending).forEach(([merchant, data]) => {
      const avgAmount = data.total / data.count;
      const estimatedMonthly = avgAmount * 4; // Rough estimate

      // Only include if it's a meaningful amount (> $20/month)
      if (estimatedMonthly < 20) return;

      // Categorize the expense
      const merchantLower = merchant.toLowerCase();
      let category: SacrificeOption["category"] = "shopping";
      let icon = "shopping_bag";

      if (
        merchantLower.includes("coffee") ||
        merchantLower.includes("starbucks") ||
        merchantLower.includes("cafe")
      ) {
        category = "coffee";
        icon = "local_cafe";
      } else if (
        merchantLower.includes("restaurant") ||
        merchantLower.includes("dining") ||
        merchantLower.includes("food")
      ) {
        category = "dining";
        icon = "restaurant";
      } else if (
        merchantLower.includes("netflix") ||
        merchantLower.includes("spotify") ||
        merchantLower.includes("subscription")
      ) {
        category = "subscription";
        icon = "subscriptions";
      } else if (
        merchantLower.includes("movie") ||
        merchantLower.includes("entertainment")
      ) {
        category = "entertainment";
        icon = "movie";
      }

      // Calculate impact on each goal
      const impact = goalsWithTargets.map((goal) => {
        const remaining = goal.targetAmount - goal.currentAmount;
        const currentMonths = Math.ceil(remaining / monthlyContributionPerGoal);
        const newMonthlyContribution =
          monthlyContributionPerGoal + estimatedMonthly;
        const newMonths = Math.ceil(remaining / newMonthlyContribution);
        const monthsSaved = Math.max(0, currentMonths - newMonths);

        return {
          monthsSaved,
          goalId: goal.id,
          goalName: goal.name,
        };
      });

      // Only include if it saves at least 1 month on any goal
      const maxImpact = Math.max(...impact.map((i) => i.monthsSaved));
      if (maxImpact >= 1) {
        options.push({
          id: merchant.toLowerCase().replace(/\s+/g, "-"),
          name: merchant,
          icon,
          monthlyAmount: estimatedMonthly,
          impact,
          category,
        });
      }
    });

    // Sort by impact (highest months saved)
    return options
      .sort((a, b) => {
        const aMax = Math.max(...a.impact.map((i) => i.monthsSaved));
        const bMax = Math.max(...b.impact.map((i) => i.monthsSaved));
        return bMax - aMax;
      })
      .slice(0, 5); // Top 5
  }, [expenses, goals, monthlyIncome]);

  if (loading) {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-black mb-4">
          Sacrifice Score
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (sacrificeOptions.length === 0) {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-black mb-2">
          Sacrifice Score
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Add more expenses and set goal targets to see which habits could
          accelerate your goals.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-black">
            Sacrifice Score
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Small changes that accelerate your goals most
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sacrificeOptions.map((option, index) => {
          const maxImpact = option.impact.reduce(
            (max, i) => (i.monthsSaved > max.monthsSaved ? i : max),
            option.impact[0]
          );

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons-round text-primary text-xl">
                    {option.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-black">
                        Skip {option.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        ~${Math.round(option.monthlyAmount).toLocaleString()}/mo
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                          -{maxImpact.monthsSaved} mo
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    Reach your{" "}
                    <span className="font-semibold">{maxImpact.goalName}</span>{" "}
                    goal {maxImpact.monthsSaved} month
                    {maxImpact.monthsSaved !== 1 ? "s" : ""} earlier
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          <strong className="text-slate-900 dark:text-black">Tip:</strong> These
          are estimates based on your current spending patterns. Small changes
          compound over time!
        </p>
      </div>
    </div>
  );
}
