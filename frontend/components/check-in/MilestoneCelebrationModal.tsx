"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, X } from "lucide-react";

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  milestoneAmount: number;
  monthsCloser?: number;
}

export default function MilestoneCelebrationModal({
  isOpen,
  onClose,
  message,
  milestoneAmount,
  monthsCloser,
}: MilestoneCelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-10 p-8 text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Milestone reached!
        </h3>
        <p className="text-4xl font-black text-teal-600 dark:text-teal-400 mb-4">
          ${milestoneAmount.toLocaleString()}
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
        {monthsCloser != null && monthsCloser > 0 && (
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
            You&apos;re now ~{monthsCloser} month{monthsCloser !== 1 ? "s" : ""}{" "}
            closer to your goal!
          </p>
        )}
        <button
          onClick={onClose}
          className="px-8 py-3 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-colors"
        >
          Awesome!
        </button>
      </motion.div>
    </motion.div>
  );
}
