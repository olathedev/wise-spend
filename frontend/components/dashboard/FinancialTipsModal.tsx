"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FinancialTip {
  id: string;
  title: string;
  content: string;
}

interface FinancialTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  tips: FinancialTip[];
  loading?: boolean;
}

const CARD_COLORS = [
  "from-teal-600 to-teal-700",
  "from-emerald-600 to-emerald-700",
  "from-violet-600 to-violet-700",
  "from-amber-600 to-amber-700",
  "from-sky-600 to-sky-700",
  "from-indigo-600 to-indigo-700",
  "from-rose-500 to-rose-600",
];

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 last:mb-0 text-white/95 leading-relaxed text-sm">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-3 ml-4 list-disc space-y-2 text-white/95 text-sm">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-3 ml-4 list-decimal space-y-2 text-white/95 text-sm">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-bold text-white mt-4 mb-2">{children}</h3>
  ),
};

export default function FinancialTipsModal({
  isOpen,
  onClose,
  topic,
  tips,
  loading = false,
}: FinancialTipsModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set());
  const total = tips.length;
  const hasContent = total > 0;

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      setCompleted(false);
      setDragOffset(0);
      setViewedCards(new Set([0])); // Mark first card as viewed
    }
  }, [isOpen]);

  // Track which cards have been viewed
  useEffect(() => {
    if (hasContent && activeIndex >= 0 && activeIndex < total) {
      setViewedCards((prev) => new Set([...prev, activeIndex]));
    }
  }, [activeIndex, total, hasContent]);

  // Check if all cards have been viewed - only show completion when ALL cards are viewed
  useEffect(() => {
    if (
      hasContent &&
      viewedCards.size === total &&
      activeIndex === total - 1 &&
      !completed
    ) {
      // Longer delay to let user read the last card before showing completion
      const timer = setTimeout(() => {
        setCompleted(true);
      }, 2000); // Increased to 2 seconds
      return () => clearTimeout(timer);
    }
  }, [viewedCards.size, total, activeIndex, hasContent, completed]);

  const goNext = () => {
    if (activeIndex < total - 1) {
      setActiveIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((i) => i - 1);
    }
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 60;
    if (info.offset.x < -threshold && activeIndex < total - 1) {
      goNext();
    } else if (info.offset.x > threshold && activeIndex > 0) {
      goPrev();
    }
    setDragOffset(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6 bg-slate-900/70 backdrop-blur-sm"
      >
        <div className="absolute inset-0" onClick={onClose} aria-hidden />
        <div className="relative w-full max-w-md flex flex-col items-center z-10">
          <button
            onClick={onClose}
            className="absolute -top-2 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shadow-lg z-20"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {loading ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl p-8 text-center"
            >
              <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4 animate-pulse">
                <Sparkles size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Generating Tips...
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Creating personalized financial tips for you
              </p>
            </motion.div>
          ) : !hasContent ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl p-8 text-center"
            >
              <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                No tips available
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                We couldn't generate tips for this topic. Please try again later.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          ) : completed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full rounded-[2rem] bg-gradient-to-br from-teal-600 to-emerald-600 shadow-2xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="size-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={48} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                🎉 Congratulations!
              </h3>
              <p className="text-white/90 text-base leading-relaxed mb-6">
                You've completed all the financial tips on{" "}
                <strong className="text-white">{topic}</strong>. Keep learning
                and building your financial knowledge!
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-white text-teal-600 font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg"
              >
                Continue Learning
              </button>
            </motion.div>
          ) : (
            <>
              <p className="text-white/80 text-sm font-medium mb-4">
                Swipe or tap arrows · {activeIndex + 1} of {total}
              </p>

              <div className="relative w-full max-w-md min-h-[420px] flex items-center justify-center">
                {/* Back cards (peek) */}
                {total > 1 &&
                  activeIndex < total - 1 &&
                  [1].map((offset) => {
                    const idx = activeIndex + offset;
                    if (idx >= total) return null;
                    const card = tips[idx];
                    const color = CARD_COLORS[idx % CARD_COLORS.length];
                    return (
                      <div
                        key={card.id}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{
                          zIndex: 0,
                          transform: `scale(0.92) rotate(-3deg)`,
                        }}
                      >
                        <div
                          className={`w-full max-w-sm h-[380px] rounded-[2rem] bg-gradient-to-br ${color} shadow-2xl border border-white/10 overflow-hidden opacity-90`}
                        />
                      </div>
                    );
                  })}

                {/* Front card - swipable */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tips[activeIndex].id}
                    className="relative w-full max-w-sm cursor-grab active:cursor-grabbing"
                    style={{ zIndex: 10 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDrag={(_, info) => setDragOffset(info.offset.x)}
                    onDragEnd={handleDragEnd}
                    initial={{ x: 0, opacity: 1 }}
                    animate={{
                      rotate: Math.min(8, Math.max(-8, dragOffset * 0.02)),
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      className={`w-full min-h-[400px] rounded-[2rem] bg-gradient-to-br ${
                        CARD_COLORS[activeIndex % CARD_COLORS.length]
                      } shadow-2xl border border-white/20 overflow-hidden flex flex-col`}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-6 pb-4 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-2xl">
                              lightbulb
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                              Tip {activeIndex + 1} of {total}
                            </p>
                            <h3 className="text-lg font-bold text-white leading-tight">
                              {tips[activeIndex].title}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0 max-h-[280px]">
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {tips[activeIndex].content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <div className="flex-shrink-0 px-6 py-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-white/60 font-medium">
                          {activeIndex < total - 1
                            ? "Swipe for more"
                            : "Last tip!"}
                        </span>
                        <span className="text-xs text-white/80 font-bold">
                          {activeIndex + 1} / {total}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Arrows */}
              {total > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors z-20 -ml-2 md:left-0 ${
                      activeIndex === 0
                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                    aria-label="Previous card"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={goNext}
                    disabled={activeIndex === total - 1}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors z-20 -mr-2 md:right-0 ${
                      activeIndex === total - 1
                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                    aria-label="Next card"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Dots */}
              {total > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {tips.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === activeIndex
                          ? "w-6 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Go to card ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={onClose}
                className="mt-6 px-8 py-3 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-colors"
              >
                {activeIndex === total - 1 ? "Finish" : "Close"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
