'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import FinancialLiteracyCards from '@/components/dashboard/FinancialLiteracyCards';
import InvestmentSuggestions from '@/components/dashboard/InvestmentSuggestions';
import AIChatPanel from '@/components/dashboard/AIChatPanel';

export default function GrowPage() {
  const [activeTab, setActiveTab] = useState<'investments' | 'knowledge'>('knowledge');

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-6 border-b border-slate-200">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
                  activeTab === 'knowledge'
                    ? 'text-teal-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Knowledge
                {activeTab === 'knowledge' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
                  activeTab === 'investments'
                    ? 'text-teal-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Investment Suggestions
                {activeTab === 'investments' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'investments' && <InvestmentSuggestions />}
            {activeTab === 'knowledge' && <FinancialLiteracyCards />}
          </div>
        </div>

        {/* Side Chat Panel - Always Visible */}
        <div className="lg:col-span-1">
          <AIChatPanel />
        </div>
      </div>
    </>
  );
}
