"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  History,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import SnapReceiptButton from "@/components/receipt/SnapReceiptButton";
import { analyzeReceipt } from "@/services/receiptService";
import AnalysisResultModal from "@/components/receipt/AnalysisResultModal";

export default function ScanPage() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "camera">("file");
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const processingRef = useRef(false);

  const handleFileSelect = useCallback(async (file: File) => {
    // Prevent multiple simultaneous requests
    if (processingRef.current) {
      return;
    }

    setError(null);
    setAnalysis(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setIsAnalyzing(true);
    processingRef.current = true;
    
    try {
      const result = await analyzeReceipt(file);
      setAnalysis(result.analysis);
      setIsResultModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze receipt.",
      );
    } finally {
      setIsAnalyzing(false);
      processingRef.current = false;
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Scan Receipt
          </h1>
          <p className="text-slate-500 max-w-md font-medium text-lg leading-relaxed">
            Multi-modal AI Financial Intelligence. Upload your receipt and let
            the agent extract spending patterns.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <button
            onClick={() => setUploadMode("file")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${uploadMode === "file" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-900"}`}
          >
            File Upload
          </button>
          <button
            onClick={() => setUploadMode("camera")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${uploadMode === "camera" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-900"}`}
          >
            Live Camera
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Interaction Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

            <div className="relative rounded-[2.5rem] border-2 border-dashed border-teal-500/30 bg-white dark:bg-slate-800 p-1 bg-opacity-50 backdrop-blur-sm">
              <div className="rounded-[2.4rem] border border-white/40 p-12 flex flex-col items-center justify-center gap-8 min-h-[450px]">
                {previewUrl ? (
                  <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-4">
                        <Loader2
                          size={48}
                          className="animate-spin text-teal-400"
                        />
                        <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse">
                          Running Neural Pass...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="size-24 bg-teal-50 rounded-[2rem] flex items-center justify-center text-teal-600 shadow-inner">
                      <ImageIcon size={40} />
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-white xfont-medium">
                        Drag & drop receipt image or PDF here (up to 20MB)
                      </p>
                    </div>
                  </>
                )}

                <div className="w-full max-w-sm">
                  <SnapReceiptButton onFileSelect={handleFileSelect} />
                </div>

                {previewUrl && !isAnalyzing && (
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setAnalysis(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-2"
                  >
                    <Plus size={16} className="rotate-45" />
                    Clear and start over
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-4"
            >
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <span className="material-symbols-outlined text-red-500">
                  error
                </span>
              </div>
              <p className="font-bold">{error}</p>
            </motion.div>
          )}

          {/* History / Recents */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">
                Recent Lab Runs
              </h3>
              <button className="text-teal-600 font-bold text-sm hover:underline">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="group p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      <History size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        Report_0{i}_Jan.pdf
                      </p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        Analyzed 2h ago
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-teal-500" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <AnalysisResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        analysis={analysis || ""}
      />
    </div>
  );
}
