'use client';

import React from 'react';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-icons-round">smart_toy</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Coach</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-icons-round text-slate-400">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="material-icons-round text-4xl text-primary">psychology</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Chat with Wise Coach</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Get personalized financial advice and insights from your AI coach.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-left">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                &ldquo;I&apos;m here to help you achieve your financial goals. Ask me anything about your spending, savings, or investment strategies.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4 bg-slate-50 dark:bg-slate-900/50">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoachModal;
