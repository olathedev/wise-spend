"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import SocraticInsightContent, {
  parseSections,
  filterValidSections,
} from "@/components/transactions/SocraticInsightContent";

interface AnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
}

export default function AnalysisResultModal({
  isOpen,
  onClose,
  analysis,
}: AnalysisResultModalProps) {
  const hasContent = React.useMemo(() => {
    if (!analysis?.trim()) return false;
    const { intro, sections } = parseSections(analysis);
    const valid = filterValidSections(sections);
    return intro.trim().length > 0 || valid.length > 0;
  }, [analysis]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute top-0 right-0 -mr-2 -mt-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="relative rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="shrink-0 flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="size-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Receipt insights
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Socratic breakdown of your spending
                </p>
              </div>
            </div>

            {/* Body: scrollable insight cards or empty state */}
            <div className="flex-1 overflow-y-auto p-6">
              {!hasContent ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    No insights generated
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">
                    We couldn’t extract enough structured insight from this receipt. Try a clearer image or another receipt.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <SocraticInsightContent insight={analysis} />
              )}
            </div>

            {/* Footer – only when we have content */}
            {hasContent && (
              <div className="shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-lg hover:brightness-110 transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
