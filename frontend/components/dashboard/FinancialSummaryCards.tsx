"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, DollarSign, ShoppingBag, Verified } from "lucide-react";
import StatCard from "./StatCard";
import { useRouter } from "next/navigation";
import { getCurrentUser, computeWiseScore } from "@/services/authService";
import { getExpenses } from "@/services/receiptService";
import { parseAmountFromTitle } from "@/lib/expenseToTransaction";
import MonthlyIncomeModal from "./MonthlyIncomeModal";

export default function FinancialSummaryCards() {
  const router = useRouter();
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
  const [monthlySpending, setMonthlySpending] = useState<number>(0);
  const [wiseScore, setWiseScore] = useState<number | null>(null);
  const [wiseScoreTier, setWiseScoreTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [wiseScoreComputing, setWiseScoreComputing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch user data for monthly income and Wise Score
        const userData = await getCurrentUser();
        setMonthlyIncome(userData.monthlyIncome ?? null);
        setWiseScore(userData.wiseScore ?? null);
        setWiseScoreTier(userData.wiseScoreTier ?? null);

        // Fetch expenses to calculate monthly spending
        const expenses = await getExpenses();
        
        // Calculate total spending for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const monthlyTotal = expenses
          .filter((expense) => {
            const expenseDate = new Date(expense.createdAt);
            return (
              expenseDate.getMonth() === currentMonth &&
              expenseDate.getFullYear() === currentYear
            );
          })
          .reduce((total, expense) => {
            return total + parseAmountFromTitle(expense.title, expense.aiDescription);
          }, 0);

        setMonthlySpending(monthlyTotal);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "$0.00";
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const calculateSpendingPercentage = (): string => {
    if (!monthlyIncome || monthlyIncome === 0) return "N/A";
    const percentage = (monthlySpending / monthlyIncome) * 100;
    return `${Math.round(percentage)}% of income`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <div className="flex flex-col justify-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/dashboard/scan")}
          className="w-full h-full min-h-[120px] md:min-h-[140px] flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
            <Camera size={28} />
          </div>
          <div className="text-center relative z-10">
            <p className="text-xs md:text-sm font-black uppercase tracking-widest leading-none mb-1">
              Snap Receipt
            </p>
            <p className="text-[10px] text-white/80 font-medium tracking-wide">
              Add New Expense
            </p>
          </div>
        </motion.button>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIncomeModalOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setIncomeModalOpen(true)}
        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-3xl"
      >
        <StatCard
          icon={<DollarSign size={24} className="text-teal-600" />}
          label="Monthly Income"
          value={loading ? "Loading..." : formatCurrency(monthlyIncome)}
          trend={monthlyIncome ? "Tap to add or edit" : "Tap to set"}
          trendType={monthlyIncome ? "neutral" : "neutral"}
        />
      </div>
      <MonthlyIncomeModal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        currentIncome={monthlyIncome}
        onSaved={(newIncome) => setMonthlyIncome(newIncome)}
      />
      <div>
        <StatCard
          icon={<ShoppingBag size={24} className="text-blue-600" />}
          label="Monthly Spending"
          value={loading ? "Loading..." : formatCurrency(monthlySpending)}
          trend={calculateSpendingPercentage()}
          trendType="neutral"
        />
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={async () => {
          if (wiseScoreComputing) return;
          setWiseScoreComputing(true);
          try {
            const result = await computeWiseScore();
            setWiseScore(result.wiseScore);
            setWiseScoreTier(result.wiseScoreTier);
          } catch (e) {
            console.error("Failed to compute Wise Score", e);
          } finally {
            setWiseScoreComputing(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !wiseScoreComputing) {
            (e.currentTarget as HTMLElement).click();
          }
        }}
        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-3xl"
      >
        <StatCard
          icon={<Verified size={24} className="text-teal-600" />}
          label="Wise Score"
          value={
            loading
              ? "Loading..."
              : wiseScoreComputing
                ? "Computing..."
                : wiseScore != null
                  ? String(wiseScore)
                  : "—"
          }
          trend={
            wiseScoreTier ??
            (wiseScore == null && !wiseScoreComputing ? "Tap to compute" : "AI-powered")
          }
          trendType={wiseScore != null ? "positive" : "neutral"}
        />
      </div>
    </div>
  );
}
