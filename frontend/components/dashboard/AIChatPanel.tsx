"use client";

import React from "react";
import { Bot } from "lucide-react";
import AIChatInterface from "./AIChatInterface";

export default function AIChatPanel() {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-teal-500 to-emerald-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              Wise Coach
            </h3>
            <p className="text-white/80 text-xs">
              Your personalized financial assistant
            </p>
          </div>
        </div>
      </div>

      <AIChatInterface className="flex-1 min-h-0" />
    </div>
  );
}
