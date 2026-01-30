"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import FinancialLiteracyCards from "@/components/dashboard/FinancialLiteracyCards";
import InvestmentSuggestions from "@/components/dashboard/InvestmentSuggestions";
import AIChatPanel from "@/components/dashboard/AIChatPanel";

export default function GrowPage() {
  const [activeTab, setActiveTab] = useState<"investments" | "knowledge">(
    "knowledge",
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            {/* Tabs - Fixed */}
            <div className="mb-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("knowledge")}
                  className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
                    activeTab === "knowledge"
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Knowledge
                  {activeTab === "knowledge" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("investments")}
                  className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
                    activeTab === "investments"
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Investment Suggestions
                  {activeTab === "investments" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {activeTab === "investments" && <InvestmentSuggestions />}
              {activeTab === "knowledge" && <FinancialLiteracyCards />}
            </div>
          </div>

          {/* Side Chat Panel - Desktop Only */}
          <div className="hidden lg:flex lg:col-span-1 flex-col min-h-0">
            <AIChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
