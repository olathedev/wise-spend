"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, Calendar, Target } from "lucide-react";
import {
  generateWeeklyCheckIn,
  saveCommitment,
  type WeeklyCheckInResponse,
} from "@/services/checkInService";
import {
  getLatestCommitment,
  completeCommitment,
  type CommitmentDto,
} from "@/services/commitmentService";

function getCurrentWeekSunday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day;
  const sunday = new Date(d);
  sunday.setDate(diff);
  return sunday.toISOString().slice(0, 10);
}

function isLastWeeksCommitment(c: CommitmentDto): boolean {
  const currentWeek = getCurrentWeekSunday();
  return c.weekOf < currentWeek && c.status === "active";
}

interface WeeklyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function WeeklyCheckInModal({
  isOpen,
  onClose,
  onSuccess,
}: WeeklyCheckInModalProps) {
  const [step, setStep] = useState<"init" | "review" | "checkin" | "done">("init");
  const [lastWeekCommitment, setLastWeekCommitment] = useState<CommitmentDto | null>(null);
  const [data, setData] = useState<WeeklyCheckInResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);
  const [lastWeekReport, setLastWeekReport] = useState("");
  const [lastWeekStatus, setLastWeekStatus] = useState<"completed" | "abandoned">("completed");

  useEffect(() => {
    if (!isOpen) return;
    setStep("init");
    setLastWeekCommitment(null);
    setData(null);
    setCommitment("");
    setCommitted(false);
    setLastWeekReport("");
    setError(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== "init") return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getLatestCommitment()
      .then((c) => {
        if (cancelled) return;
        if (c && isLastWeeksCommitment(c)) {
          setLastWeekCommitment(c);
          setStep("review");
        } else {
          loadCheckIn(undefined);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, step]);

  const loadCheckIn = (lastWeek?: { commitment: string; report: string }) => {
    setStep("checkin");
    setLoading(true);
    setError(null);
    generateWeeklyCheckIn(
      lastWeek
        ? {
            lastWeekCommitment: lastWeek.commitment,
            lastWeekCompletionReport: lastWeek.report,
          }
        : undefined,
    )
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  const handleLastWeekSubmit = async () => {
    if (!lastWeekCommitment?.id) return;
    setSaving(true);
    setError(null);
    try {
      const report = lastWeekReport.trim() || (lastWeekStatus === "completed" ? "I did it!" : "Couldn't stick to it.");
      await completeCommitment(lastWeekCommitment.id, report, lastWeekStatus);
      loadCheckIn({
        commitment: lastWeekCommitment.commitmentText,
        report,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleCommit = async () => {
    const text = commitment.trim();
    if (!text) return;
    setSaving(true);
    setError(null);
    try {
      await saveCommitment(text);
      setCommitted(true);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save commitment");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setData(null);
      setCommitment("");
      setCommitted(false);
      setError(null);
    }, 300);
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
        <div className="absolute inset-0" onClick={handleClose} aria-hidden />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Weekly Check-In
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  5-minute reflection
                </p>
              </div>
            </div>

            {step === "review" && lastWeekCommitment ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Target size={18} className="text-amber-600" />
                    How did last week&apos;s commitment go?
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    You committed to: <strong>{lastWeekCommitment.commitmentText}</strong>
                  </p>
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setLastWeekStatus("completed")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        lastWeekStatus === "completed"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      type="button"
                      onClick={() => setLastWeekStatus("abandoned")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        lastWeekStatus === "abandoned"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Couldn&apos;t stick to it
                    </button>
                  </div>
                  <textarea
                    value={lastWeekReport}
                    onChange={(e) => setLastWeekReport(e.target.value)}
                    placeholder="Optional: add a quick note (e.g. what helped or what got in the way)"
                    className="w-full h-20 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none text-sm"
                    disabled={saving}
                  />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleLastWeekSubmit}
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Continue to this week"}
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-teal-500" />
                <p className="text-slate-600 dark:text-slate-400">
                  {step === "init" ? "Checking for last week's commitment..." : "Preparing your check-in..."}
                </p>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : committed ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Commitment saved!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  You committed to: <strong>{commitment}</strong>
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : data ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {data.weekSummary}
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {data.question}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Commit to ONE micro-action for this week:
                  </p>
                  {data.suggestedCommitments && data.suggestedCommitments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {data.suggestedCommitments.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setCommitment(commitment === s ? "" : s)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            commitment === s
                              ? "bg-teal-500 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-transparent hover:border-teal-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={commitment}
                    onChange={(e) => setCommitment(e.target.value)}
                    placeholder="Or type your own..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleCommit}
                    disabled={saving || !commitment.trim()}
                    className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving..." : "Commit"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
