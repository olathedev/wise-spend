"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import {
  MOCK_TRANSACTIONS,
  CATEGORIES,
} from "@/components/transactions/constants";
import { Category, Insight, Transaction } from "@/components/types";
import { getFinancialInsight } from "@/components/transactions/services/geminiService";
import CategoryBadge from "@/components/transactions/CategoryBadge";
import ReceiptModal from "@/components/transactions/ReceiptModal";

export default function TransactionsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const data = await getFinancialInsight(MOCK_TRANSACTIONS);
      setInsight(data);
      setLoadingInsight(false);
    };
    fetchInsight();
  }, []);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((t) => {
      const matchesCategory =
        activeCategory === "All" || t.category === activeCategory;
      const matchesSearch = t.vendor
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <Header />

      <div className="mb-8 px-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
          Transactions
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Manage and track your expenses with AI verification.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.value
                  ? "bg-primary text-white shadow-lg shadow-teal-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:min-w-[300px] sm:w-auto">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        <div className="flex-1 bg-white dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          {/* Desktop Table View */}
          <div className="flex-1 overflow-x-auto hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm font-medium">{t.date}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <span className="material-icons-round text-sm text-slate-600 dark:text-slate-300">
                            {t.icon}
                          </span>
                        </div>
                        <span className="text-sm font-bold">{t.vendor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <CategoryBadge category={t.category} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-lg w-fit">
                        <span className="material-icons-round text-xs">
                          auto_awesome
                        </span>
                        <span className="text-[10px] font-bold uppercase">
                          {t.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-900 dark:text-white">
                      {t.amount < 0
                        ? `-$${Math.abs(t.amount).toFixed(2)}`
                        : `+$${t.amount.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => setSelectedTransaction(t)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="p-4 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <span className="material-icons-round text-slate-600 dark:text-slate-300">
                        {t.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {t.vendor}
                      </h4>
                      <p className="text-xs text-slate-500">{t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {t.amount < 0
                        ? `-$${Math.abs(t.amount).toFixed(2)}`
                        : `+$${t.amount.toFixed(2)}`}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="material-icons-round text-[10px] text-teal-500">
                        auto_awesome
                      </span>
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tighter">
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <CategoryBadge category={t.category} />
                  <button
                    onClick={() => setSelectedTransaction(t)}
                    className="text-xs font-bold text-primary px-3 py-1.5 bg-primary/5 rounded-lg active:bg-primary/10"
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
              Showing {filteredTransactions.length} of{" "}
              {MOCK_TRANSACTIONS.length}
            </p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-colors">
                <span className="material-icons-round text-lg">
                  chevron_left
                </span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-colors">
                <span className="material-icons-round text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          {/* Socratic Tip Card */}
          <div className="bg-primary p-5 sm:p-6 rounded-2xl shadow-lg shadow-teal-500/20">
            <div className="flex items-center gap-2 text-white/80 mb-4">
              <span className="material-icons-round text-white">
                psychology
              </span>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white/90">
                Socratic Tip
              </h4>
            </div>
            {loadingInsight ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-white/20 rounded w-full"></div>
                <div className="h-3 bg-white/20 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-sm font-medium text-white leading-relaxed italic">
                &ldquo;
                {insight?.tip ||
                  "Analyze your spending to get personalized tips."}
                &rdquo;
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-bold text-teal-200 uppercase">
                Potential Savings
              </span>
              <span className="text-sm font-bold text-white">
                {insight?.potentialSavings || "$0.00/yr"}
              </span>
            </div>
          </div>

          {/* Verification Health Card */}
          <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm">
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">
              Verification Health
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-wider text-slate-500">
                  <span>Auto-Categorized</span>
                  <span className="text-slate-900 dark:text-white">92%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your AI assistant has successfully verified 118 out of 128
                transactions this month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
}
