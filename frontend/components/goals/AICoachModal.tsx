"use client";

import React from "react";
import AIChatInterface from "../dashboard/AIChatInterface";

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[600px] max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
              <span className="material-icons-round">smart_toy</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Wise AI Coach
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-icons-round text-slate-400">close</span>
          </button>
        </div>

        {/* Chat Interface */}
        <AIChatInterface
          className="flex-1 min-h-0"
          initialMessage="Hi! I'm your AI Coach. How can I help you reach your financial goals today?"
        />
      </div>
    </div>
  );
};

export default AICoachModal;
