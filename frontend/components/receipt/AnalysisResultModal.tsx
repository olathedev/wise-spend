"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  parseSections,
  filterValidSections,
} from "@/components/transactions/SocraticInsightContent";

interface AnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
}

const CARD_COLORS = [
  "from-teal-700 to-teal-800",
  "from-emerald-700 to-emerald-800",
  "from-violet-700 to-violet-800",
  "from-amber-700 to-amber-800",
  "from-sky-700 to-sky-800",
  "from-slate-700 to-slate-800",
  "from-rose-600 to-rose-700",
];

const SECTION_ICONS: Record<string, string> = {
  "spending extraction": "receipt_long",
  "match against income": "trending_up",
  "match against goals": "flag",
  verdict: "gavel",
  suggestions: "lightbulb",
  summary: "summarize",
  reflection: "psychology",
};

function getSectionIcon(title: string): string {
  const key = Object.keys(SECTION_ICONS).find((k) =>
    title.toLowerCase().includes(k)
  );
  return key ? SECTION_ICONS[key] : "summarize";
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 text-white/90 leading-relaxed text-sm">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-2 ml-4 list-disc space-y-1 text-white/90 text-sm">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-2 ml-4 list-decimal space-y-1 text-white/90 text-sm">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
};

export default function AnalysisResultModal({
  isOpen,
  onClose,
  analysis,
}: AnalysisResultModalProps) {
  const cards = useMemo(() => {
    if (!analysis?.trim()) return [];
    const { intro, sections } = parseSections(analysis);
    const valid = filterValidSections(sections);
    const list: { id: string; title: string; content: string; isIntro?: boolean }[] = [];
    if (intro.trim()) {
      list.push({
        id: "intro",
        title: "Your receipt insight",
        content: intro.trim(),
        isIntro: true,
      });
    }
    valid.forEach((s) => {
      list.push({
        id: `s-${s.index}`,
        title: s.title,
        content: s.content,
      });
    });
    return list;
  }, [analysis]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const total = cards.length;
  const hasContent = total > 0;

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % total);
  };
  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + total) % total);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goNext();
    else if (info.offset.x > threshold) goPrev();
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

          {!hasContent ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl p-8 text-center"
            >
              <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                No insights yet
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-6">
                We couldn’t get enough from this receipt. Try a clearer photo or another receipt!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600 transition-colors"
              >
                Close
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
                  [1, 2].map((offset) => {
                    const idx = (activeIndex + offset) % total;
                    const card = cards[idx];
                    const color = CARD_COLORS[idx % CARD_COLORS.length];
                    const rot = offset === 1 ? -3 : 2;
                    const scale = offset === 1 ? 0.92 : 0.85;
                    const z = offset === 1 ? 0 : -1;
                    return (
                      <div
                        key={card.id}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{
                          zIndex: z,
                          transform: `scale(${scale}) rotate(${rot}deg)`,
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
                    key={cards[activeIndex].id}
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
                      className={`w-full min-h-[400px] rounded-[2rem] bg-gradient-to-br ${CARD_COLORS[activeIndex % CARD_COLORS.length]} shadow-2xl border border-white/20 overflow-hidden flex flex-col`}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-6 pb-4 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-2xl">
                              {cards[activeIndex].isIntro
                                ? "auto_awesome"
                                : getSectionIcon(cards[activeIndex].title)}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                              Insight {activeIndex + 1} of {total}
                            </p>
                            <h3 className="text-lg font-bold text-white leading-tight">
                              {cards[activeIndex].title}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0 max-h-[240px]">
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {cards[activeIndex].content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <div className="flex-shrink-0 px-6 py-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-white/60 font-medium">
                          Swipe for more
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
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-20 -ml-2 md:left-0"
                    aria-label="Previous card"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-20 -mr-2 md:right-0"
                    aria-label="Next card"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Dots */}
              {total > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {cards.map((_, i) => (
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
                Done
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
