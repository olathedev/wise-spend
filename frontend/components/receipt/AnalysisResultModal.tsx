"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface AnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 last:mb-0 text-slate-700 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-teal-700">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-3 ml-4 list-disc space-y-1.5 text-slate-700">
      {children}
    </ul>
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
  const [activeCard, setActiveCard] = useState(0);

  const sections = React.useMemo(() => {
    if (!analysis) return [];
    // Split by numbered sections (e.g., "1. Spending Extraction")
    const parts = analysis.split(/\n?(?=\d+\.\s)/).filter(Boolean);
    return parts.map((part) => {
      const lines = part.trim().split("\n");
      const title = lines[0]
        .replace(/^\d+\.\s+/, "") // Remove "1. "
        .replace(/\*\*/g, "") // Remove "**"
        .replace(/:$/, "") // Remove trailing colons
        .trim();
      const content = lines.slice(1).join("\n").trim();
      return { title, content };
    });
  }, [analysis]);

  const totalCards = sections.length;

  const nextCard = () => setActiveCard((prev) => (prev + 1) % totalCards);
  const prevCard = () =>
    setActiveCard((prev) => (prev - 1 + totalCards) % totalCards);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -100) {
      nextCard();
    } else if (info.offset.x > 100) {
      prevCard();
    }
  };

  if (!isOpen || sections.length === 0) return null;

  const currentSection = sections[activeCard];

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
          className="relative w-full max-w-lg"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>

          {/* Desktop Navigation Arrows */}
          {totalCards > 1 && (
            <div className="hidden md:block">
              <button
                onClick={prevCard}
                className="absolute -left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextCard}
                className="absolute -right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}

          <div className="relative">
            {/* Background stacks */}
            <div className="absolute top-4 inset-x-4 h-full bg-white/20 rounded-3xl translate-y-4 scale-95 blur-sm opacity-50"></div>
            <div className="absolute top-2 inset-x-2 h-full bg-white/30 rounded-3xl translate-y-2 scale-[0.97] blur-[2px] opacity-70"></div>

            <div className="teal-gradient-border card-stack-shadow rounded-[2.5rem] overflow-hidden relative bg-white">
              <div className="relative p-8 md:p-10">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-50 pointer-events-none">
                  <div
                    className="confetti-particle animate-float"
                    style={{
                      top: "10%",
                      left: "15%",
                      width: "6px",
                      height: "6px",
                    }}
                  ></div>
                  <div
                    className="confetti-particle animate-float"
                    style={{
                      top: "25%",
                      left: "80%",
                      width: "8px",
                      height: "8px",
                      background: "#99f6e4",
                      animationDelay: "1s",
                    }}
                  ></div>
                  <div
                    className="confetti-particle animate-float"
                    style={{
                      top: "40%",
                      left: "50%",
                      width: "5px",
                      height: "5px",
                      background: "#0d9488",
                      animationDelay: "0.5s",
                    }}
                  ></div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCard}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, x: 50, rotate: 2 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: -50, rotate: -2 }}
                    className="min-h-[420px] flex flex-col cursor-grab active:cursor-grabbing"
                  >
                    <div className="text-center mb-8">
                      {activeCard === 0 && (
                        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full border border-teal-100 mb-4 animate-bounce">
                          <span className="material-symbols-outlined text-sm">
                            stars
                          </span>
                          <span className="text-sm font-bold tracking-wide">
                            +15 Wise Points
                          </span>
                        </div>
                      )}
                      {activeCard > 0 && (
                        <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-2 rounded-full border border-slate-100 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Insight {activeCard + 1} of {totalCards}
                          </span>
                        </div>
                      )}
                      <h2 className="text-3xl font-black text-slate-900 mb-2">
                        {currentSection.title}
                      </h2>
                    </div>

                    <div className="space-y-6 flex-1">
                      <div className="text-slate-600 leading-relaxed text-sm md:text-base">
                        <ReactMarkdown components={markdownComponents}>
                          {currentSection.content}
                        </ReactMarkdown>
                      </div>

                      {activeCard === 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-auto">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-100 transition-colors">
                            <span className="material-symbols-outlined text-teal-600 mb-2">
                              receipt_long
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              Status
                            </p>
                            <p className="font-bold text-slate-900 text-xs">
                              Extracted
                            </p>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-100 transition-colors">
                            <span className="material-symbols-outlined text-teal-600 mb-2">
                              verified
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              Neural Check
                            </p>
                            <p className="font-bold text-slate-900 text-xs">
                              Verified
                            </p>
                          </div>
                        </div>
                      )}

                      {currentSection.title
                        .toLowerCase()
                        .includes("verdict") && (
                        <div className="mt-auto p-4 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold flex items-center gap-3">
                          <span className="material-symbols-outlined">
                            gavel
                          </span>
                          Certified Wise Spending Decision
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="mt-8 flex justify-center items-center gap-3">
                  {sections.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCard(i)}
                      className={`h-1.5 transition-all rounded-full ${
                        activeCard === i
                          ? "w-8 bg-teal-500"
                          : "w-1.5 bg-slate-100 hover:bg-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="w-full mt-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  {activeCard === totalCards - 1
                    ? "Confirm Lab Data"
                    : "Next Insight"}
                </button>
              </div>
            </div>

            {/* Hint for mobile */}
            <div className="md:hidden mt-6 text-center text-white/60 text-sm flex items-center justify-center gap-2 font-medium">
              <span className="material-symbols-outlined text-lg animate-bounce">
                swipe
              </span>
              Swipe cards to navigate
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
