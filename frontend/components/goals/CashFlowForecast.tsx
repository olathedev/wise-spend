"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getExpenses, ExpenseDto } from "@/services/receiptService";
import { parseAmountFromTitle } from "@/lib/expenseToTransaction";
import { getCurrentUser } from "@/services/authService";

interface ForecastMonth {
  month: string;
  date: Date;
  income: number;
  expenses: number;
  net: number;
  status: "surplus" | "shortfall" | "tight";
  alert?: string;
}

export default function CashFlowForecast() {
  const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [expensesData, user] = await Promise.all([
          getExpenses(),
          getCurrentUser(),
        ]);
        setExpenses(expensesData);
        setMonthlyIncome(user.monthlyIncome);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const forecast = useMemo(() => {
    if (!monthlyIncome) return [];

    const now = new Date();
    const forecastMonths: ForecastMonth[] = [];

    // Calculate average monthly expenses from last 3 months
    const monthlyTotals: Record<string, number> = {};
    expenses.forEach((exp) => {
      const date = new Date(exp.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const amount = parseAmountFromTitle(exp.title, exp.aiDescription);
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amount;
    });

    const monthlyValues = Object.values(monthlyTotals);
    const avgMonthlyExpenses =
      monthlyValues.length > 0
        ? monthlyValues.reduce((a, b) => a + b, 0) / monthlyValues.length
        : 0;

    // Generate 3-month forecast
    for (let i = 0; i < 3; i++) {
      const forecastDate = new Date(now);
      forecastDate.setMonth(forecastDate.getMonth() + i + 1);
      const monthName = forecastDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const projectedExpenses = avgMonthlyExpenses;
      const net = monthlyIncome - projectedExpenses;
      const percentage = (net / monthlyIncome) * 100;

      let status: "surplus" | "shortfall" | "tight";
      let alert: string | undefined;

      if (net < 0) {
        status = "shortfall";
        alert = `You might run short by $${Math.abs(net).toLocaleString()}`;
      } else if (percentage < 10) {
        status = "tight";
        alert = `Cash flow will be tight (${percentage.toFixed(0)}% buffer)`;
      } else {
        status = "surplus";
      }

      forecastMonths.push({
        month: monthName,
        date: forecastDate,
        income: monthlyIncome,
        expenses: projectedExpenses,
        net,
        status,
        alert,
      });
    }

    return forecastMonths;
  }, [expenses, monthlyIncome]);

  if (loading) {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-black mb-4">
          Cash Flow Forecast
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!monthlyIncome) {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-black mb-2">
          Cash Flow Forecast
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Set your monthly income to see cash flow predictions.
        </p>
      </div>
    );
  }

  const hasAlerts = forecast.some((f) => f.alert);

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-black">
            Cash Flow Forecast
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            3-month projection based on your patterns
          </p>
        </div>
        {hasAlerts && (
          <span className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs font-bold">
            Alert
          </span>
        )}
      </div>

      <div className="space-y-4">
        {forecast.map((month, index) => (
          <motion.div
            key={month.month}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${
              month.status === "shortfall"
                ? "bg-card-light border border-slate-100 dark:border-slate-300 shadow-sm p-6"
                : month.status === "tight"
                  ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-black">
                  {month.month}
                </h4>
                {month.alert && (
                  <p className="text-xs mt-1 font-medium text-red-700 dark:text-red-300">
                    ⚠️ {month.alert}
                  </p>
                )}
              </div>
              <div
                className={`px-3 py-1 rounded-lg font-bold text-sm ${
                  month.net >= 0
                    ? "bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
                    : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                }`}
              >
                {month.net >= 0 ? "+" : ""}$
                {Math.abs(month.net).toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Income
                </p>
                <p className="font-bold text-slate-900 dark:text-black">
                  ${month.income.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Expenses
                </p>
                <p className="font-bold text-slate-900 dark:text-black">
                  ${Math.round(month.expenses).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasAlerts && (
        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-slate-900 dark:text-black">
              Proactive Planning:
            </strong>{" "}
            Based on your patterns, you might run tight next month. Want to plan
            together? Consider reducing discretionary spending or increasing
            income.
          </p>
        </div>
      )}
    </div>
  );
}
