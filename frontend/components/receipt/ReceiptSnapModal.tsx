"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Camera, Loader2, Sparkles } from "lucide-react";
import SnapReceiptButton from "./SnapReceiptButton";
import { analyzeReceipt } from "@/services/receiptService";
import { useTypewriter } from "@/hooks/useTypewriter";

interface ReceiptSnapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 last:mb-0 text-slate-700 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-teal-700">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-3 ml-4 list-disc space-y-1.5 text-slate-700">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-3 ml-4 list-decimal space-y-1.5 text-slate-700">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-2 mt-4 text-lg font-bold text-slate-900 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-2 mt-4 text-base font-semibold text-slate-800 first:mt-0">{children}</h2>
  ),
};

export default function ReceiptSnapModal({ isOpen, onClose }: ReceiptSnapModalProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { visibleText, isComplete } = useTypewriter(analysis, {
    charsPerTick: 4,
    enabled: !!analysis,
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setAnalysis(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setIsAnalyzing(true);
    try {
      const result = await analyzeReceipt(file);
      setAnalysis(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze receipt.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setAnalysis(null);
    setError(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-50 to-white"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-sm safe-area-inset-top md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10">
              <Camera className="h-5 w-5 text-teal-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
              Snap Receipt
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
          {!analysis && !isAnalyzing && (
            <div className="mb-6 rounded-2xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
              <p className="text-sm text-slate-600 md:text-base leading-relaxed">
                Capture or upload a receipt. We’ll analyze the spending against
                your income and goals and give you a short review.
              </p>
            </div>
          )}

          {!analysis && !isAnalyzing && (
            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-sm">
                <SnapReceiptButton onFileSelect={handleFileSelect} />
              </div>
            </div>
          )}

          {previewUrl && !analysis && isAnalyzing && (
            <div className="mb-6 flex flex-col items-center gap-5">
              <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-md">
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="aspect-3/4 w-full object-cover"
                />
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-teal-50 px-4 py-3 text-teal-700">
                <Loader2 size={20} className="animate-spin shrink-0" />
                <span className="text-sm font-medium">Analyzing receipt…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Spending analysis</span>
                  {!isComplete && (
                    <span className="ml-2 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-teal-500" />
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="max-h-[50vh] overflow-y-auto p-5 md:p-6">
                  <div className="receipt-analysis prose prose-slate max-w-none text-sm md:text-base">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {visibleText}
                    </ReactMarkdown>
                    {!isComplete && visibleText && (
                      <span className="inline-block h-4 w-0.5 animate-pulse rounded bg-teal-500 align-middle" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAnalysis(null);
                    setPreviewUrl((prev) => {
                      if (prev) URL.revokeObjectURL(prev);
                      return null;
                    });
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300"
                >
                  Analyze another
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-teal-600"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
