"use client";

import React, { useState, useEffect } from "react";
import { Target, Calendar, Loader2, MessageSquare } from "lucide-react";
import {
  getActiveCommitment,
  midWeekUpdate,
  type CommitmentDto,
} from "@/services/commitmentService";

export default function CommitmentCard() {
  const [commitment, setCommitment] = useState<CommitmentDto | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCommitment();
  }, []);

  const loadCommitment = async () => {
    try {
      setLoading(true);
      const { commitment: c, daysRemaining: d } = await getActiveCommitment();
      setCommitment(c);
      setDaysRemaining(d);
    } catch {
      setCommitment(null);
      setDaysRemaining(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMidWeekSubmit = async () => {
    if (!commitment?.id || !updateText.trim()) return;
    try {
      setSubmitting(true);
      await midWeekUpdate(commitment.id, updateText.trim());
      setShowUpdateModal(false);
      setUpdateText("");
      await loadCommitment();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center min-h-[140px]">
        <Loader2 size={24} className="animate-spin text-teal-500" />
      </div>
    );
  }

  if (!commitment) return null;

  const needsMidWeek = !commitment.midWeekResponse && daysRemaining <= 4;

  return (
    <>
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                <Target size={18} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                This Week&apos;s Commitment
              </h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">
              {commitment.commitmentText}
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Calendar size={14} />
                {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left
              </span>
              {commitment.midWeekResponse && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Mid-week checked in ✓
                </span>
              )}
            </div>
          </div>
          {needsMidWeek && (
            <button
              onClick={() => setShowUpdateModal(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition-colors"
            >
              <MessageSquare size={16} />
              Quick update
            </button>
          )}
        </div>
      </div>

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Mid-week check-in
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              How&apos;s your commitment going? Share a quick update.
            </p>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="e.g. Packed lunch 2x so far, struggling with Friday..."
              className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
              disabled={submitting}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setUpdateText("");
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleMidWeekSubmit}
                disabled={!updateText.trim() || submitting}
                className="flex-1 px-4 py-2 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
