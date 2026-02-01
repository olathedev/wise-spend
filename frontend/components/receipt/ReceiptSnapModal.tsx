"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2, FileText } from "lucide-react";
import SnapReceiptButton from "./SnapReceiptButton";
import { analyzeReceipt } from "@/services/receiptService";

interface ReceiptSnapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptSnapModal({ isOpen, onClose }: ReceiptSnapModalProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        className="fixed inset-0 z-50 flex flex-col bg-white"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/60 bg-white px-4 py-3 safe-area-inset-top md:px-6">
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
            Snap Receipt
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
          {!analysis && !isAnalyzing && (
            <div className="mb-6">
              <p className="text-sm text-slate-600 md:text-base">
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
            <div className="mb-6 flex flex-col items-center gap-4">
              <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-teal-600">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm font-medium">Analyzing receipt…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-3 flex items-center gap-2 text-slate-700">
                <FileText size={20} />
                <span className="font-medium">Analysis</span>
              </div>
              <div className="prose prose-slate max-w-none flex-1 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-700 md:p-6 md:text-base">
                {analysis.split("\n").map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAnalysis(null);
                    setPreviewUrl((prev) => {
                      if (prev) URL.revokeObjectURL(prev);
                      return null;
                    });
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                  Analyze another
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-600"
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
