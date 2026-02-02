"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, X, Plus } from "lucide-react";
import { updateProfile } from "@/services/authService";

interface MonthlyIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIncome: number | null;
  onSaved: (newIncome: number) => void;
}

export default function MonthlyIncomeModal({
  isOpen,
  onClose,
  currentIncome,
  onSaved,
}: MonthlyIncomeModalProps) {
  const [addAmount, setAddAmount] = useState("");
  const [setTotalAmount, setSetTotalAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = currentIncome ?? 0;
  const addNum = (() => {
    const s = addAmount.replace(/,/g, "").trim();
    if (!s) return 0;
    const n = parseFloat(s);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  })();
  const newTotal = current + addNum;
  const setTotalNum = (() => {
    const s = setTotalAmount.replace(/,/g, "").trim();
    if (!s) return null;
    const n = parseFloat(s);
    return Number.isFinite(n) && n >= 0 ? n : null;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (addNum <= 0) {
      setError("Enter an amount to add.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({ monthlyIncome: newTotal });
      onSaved(updated.monthlyIncome ?? newTotal);
      setAddAmount("");
      setSetTotalAmount("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetTotal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setTotalNum === null) {
      setError("Enter a valid amount.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const updated = await updateProfile({ monthlyIncome: setTotalNum });
      onSaved(updated.monthlyIncome ?? setTotalNum);
      setAddAmount("");
      setSetTotalAmount("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <DollarSign size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Monthly Income
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Current monthly income
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              ${formatCurrency(current)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Stored in your profile — available wherever you log in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="add-amount" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Add income (e.g. new job, side gig)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">
                  $
                </span>
                <input
                  id="add-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
              {addNum > 0 && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  New total: <span className="font-bold text-teal-600 dark:text-teal-400">${formatCurrency(newTotal)}</span>
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || addNum <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving…" : "Add & Save"}
                <Plus size={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Or set a new total (replaces current):
            </p>
            <form onSubmit={handleSetTotal} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="New total"
                  value={setTotalAmount}
                  onChange={(e) => setSetTotalAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={saving || setTotalNum === null}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
              >
                Set Total
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
