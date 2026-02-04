"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Calendar, Flag } from "lucide-react";
import { GOALS_LIST } from "./constants";
import { updateProfile } from "@/services/authService";

interface SetTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  currentTarget?: number;
  currentDeadline?: string;
  currentPrimary?: boolean;
  onSuccess: () => void;
}

type Step = "why" | "target";

export default function SetTargetModal({
  isOpen,
  onClose,
  goalId,
  currentTarget,
  currentDeadline,
  currentPrimary = false,
  onSuccess,
}: SetTargetModalProps) {
  const [step, setStep] = useState<Step>("why");
  const [whyMatters, setWhyMatters] = useState("");
  const [targetAmount, setTargetAmount] = useState(
    currentTarget ? currentTarget.toString() : ""
  );
  const [deadline, setDeadline] = useState(
    currentDeadline ? currentDeadline.slice(0, 10) : ""
  );
  const [setAsPrimary, setSetAsPrimary] = useState(currentPrimary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goal = GOALS_LIST.find((g) => g.id === goalId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(targetAmount.replace(/,/g, "").trim());
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid target amount greater than 0");
      return;
    }

    setLoading(true);
    try {
      const { getCurrentUser } = await import("@/services/authService");
      const user = await getCurrentUser();
      const currentGoalTargets = user.goalTargets || {};
      const currentGoalDeadlines = user.goalDeadlines || {};

      const updatedGoalTargets = { ...currentGoalTargets, [goalId]: amount };
      const updatedGoalDeadlines = deadline.trim()
        ? { ...currentGoalDeadlines, [goalId]: deadline }
        : { ...currentGoalDeadlines };
      if (!deadline.trim() && updatedGoalDeadlines[goalId]) {
        delete updatedGoalDeadlines[goalId];
      }

      await updateProfile({
        goalTargets: updatedGoalTargets,
        goalDeadlines: Object.keys(updatedGoalDeadlines).length > 0 ? updatedGoalDeadlines : undefined,
        primaryGoalId: setAsPrimary ? goalId : (user.primaryGoalId === goalId ? null : undefined),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error setting target:", err);
      // Extract error message from API response if available
      const errorMessage =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Failed to set target. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.,]/g, "");
    setTargetAmount(value);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      >
        <div className="absolute inset-0" onClick={onClose} aria-hidden />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {step === "why" ? "Make it meaningful" : "Set Target & Deadline"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {step === "why"
                  ? "Why does this goal matter to you? What happens if you don't achieve it?"
                  : `Set your target and deadline for ${goal?.label || goalId}`}
              </p>
            </div>

            {step === "why" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Why does this matter to you? (optional)
                  </label>
                  <textarea
                    value={whyMatters}
                    onChange={(e) => setWhyMatters(e.target.value)}
                    placeholder="e.g. Security for my family, freedom to travel..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-900 dark:text-white outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("target")}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="targetAmount"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Target Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      id="targetAmount"
                      type="text"
                      value={targetAmount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg font-bold text-slate-900 dark:text-white outline-none"
                      autoFocus
                    />
                  </div>
                  {goal?.description && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{goal.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Deadline (optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={setAsPrimary}
                    onChange={(e) => setSetAsPrimary(e.target.checked)}
                    className="rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                  />
                  <div className="flex items-center gap-2">
                    <Flag size={18} className="text-teal-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Set as my primary goal (for focused coaching)
                    </span>
                  </div>
                </label>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("why")}
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !targetAmount.trim()}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Set Target"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
