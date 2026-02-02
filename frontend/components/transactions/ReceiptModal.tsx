'use client';

import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { generateSocraticInsight } from './services/geminiService';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const [insight, setInsight] = useState<string>('Analyzing your spending patterns...');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transaction?.receiptAnalysis) {
      setInsight(transaction.receiptAnalysis);
      setIsLoading(false);
      return;
    }
    if (transaction) {
      setIsLoading(true);
      generateSocraticInsight(transaction).then(res => {
        setInsight(res);
        setIsLoading(false);
      });
    }
  }, [transaction]);

  if (!transaction) return null;

  // Use default values if extended fields are not available
  const receiptItems = transaction.items || [
    { name: transaction.vendor, price: Math.abs(transaction.amount), type: transaction.category === 'Essentials' ? 'ESSENTIAL' as const : 'LUXURY' as const }
  ];
  const receiptTotal = transaction.total || Math.abs(transaction.amount);
  const receiptAddress = transaction.address || '123 Main Street, City, State 12345';
  const receiptTime = transaction.time || '12:00 PM';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
              <span className="material-icons-round">receipt</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Receipt Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-icons-round text-slate-400">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            
            {/* Left Column: Visual Receipt */}
            <div className="relative bg-slate-100 dark:bg-slate-800/50 rounded-3xl overflow-hidden flex items-center justify-center p-8 min-h-[500px]">
              {transaction.imageUrl ? (
                <img
                  src={transaction.imageUrl}
                  alt={`Receipt for ${transaction.vendor}`}
                  className="max-w-full max-h-[500px] w-auto object-contain rounded-2xl shadow-2xl"
                />
              ) : (
              <div className="relative bg-white dark:bg-slate-50 shadow-2xl p-8 w-full max-w-sm flex flex-col items-center animate-in slide-in-from-left-4 duration-700">
                <div className="text-center mb-8">
                  <h3 className="font-bold text-lg uppercase tracking-[0.2em] text-slate-800">{transaction.vendor}</h3>
                  <p className="text-[10px] text-slate-500 mt-1">{receiptAddress}</p>
                </div>
                
                <div className="w-full space-y-4 font-mono text-[11px] text-slate-700">
                  {receiptItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center relative p-1.5 group">
                      <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5 rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5 rounded pointer-events-none"></div>
                      <span>{item.name}</span>
                      <span className="font-bold">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-dashed border-slate-300 pt-6 mt-8">
                    <div className="flex justify-between font-bold text-base relative p-2">
                      <div className="absolute inset-0 border-2 border-primary/40 bg-primary/5 rounded pointer-events-none"></div>
                      <span>TOTAL</span>
                      <span className="text-primary">${receiptTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 text-[9px] text-slate-400 text-center tracking-widest uppercase">
                  Thank you for shopping with us
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={`h-4 w-1 bg-slate-200 ${i % 3 === 0 ? 'h-6' : ''}`}></div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Right Column: Data & Insights */}
            <div className="flex flex-col h-full">
              <div className="mb-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Vendor</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{transaction.vendor}</h3>
                    <p className="text-sm text-slate-500 mt-1">{transaction.date} • {receiptTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Total Amount</p>
                    <h3 className="text-4xl font-bold text-primary">${receiptTotal.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl mb-8 bg-white dark:bg-slate-800">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4 text-center">Type</th>
                        <th className="px-6 py-4 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                      {receiptItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{item.name}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.type === 'ESSENTIAL' 
                                ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' 
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">${item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* AI Insight Box */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
                  <div className="relative bg-white dark:bg-slate-800 border border-teal-100 dark:border-teal-900/30 rounded-3xl p-8 shadow-sm">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                        <span className="material-icons-round">lightbulb</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-teal-900 dark:text-teal-400 text-lg mb-2">Socratic Insight</h4>
                        <div className={`text-sm text-slate-600 dark:text-teal-400/80 leading-relaxed ${isLoading ? 'animate-pulse italic text-slate-400' : ''}`}>
                          {insight}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-sm transition-colors group">
            <span className="material-icons-round text-lg group-hover:shake">delete_outline</span>
            Delete Transaction
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Close
            </button>
            <button className="px-8 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-teal-500/20 hover:brightness-110 active:scale-95 transition-all">
              Edit Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
