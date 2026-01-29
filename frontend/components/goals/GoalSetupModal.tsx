'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoalData, Step } from '../types';
import { getSocraticTip } from '../transactions/services/geminiService';

interface GoalSetupModalProps {
  onClose: () => void;
  onCreate: (goal: GoalData) => void;
}

const GoalSetupModal: React.FC<GoalSetupModalProps> = ({ onClose, onCreate }) => {
  const [step, setStep] = useState<Step>(Step.TARGET);
  const [goalData, setGoalData] = useState<GoalData>({
    name: 'New SUV Down Payment',
    targetAmount: 25000,
    monthlyContribution: 1200,
    aiCoachEnabled: true,
    category: 'savings',
  });
  const [aiTip, setAiTip] = useState<string>('I&apos;ll look for minor surpluses in your &apos;Dining&apos; and &apos;Leisure&apos; categories.');
  const [loadingTip, setLoadingTip] = useState(false);

  const fetchTip = useCallback(async () => {
    if (goalData.aiCoachEnabled) {
      setLoadingTip(true);
      const tip = await getSocraticTip(goalData);
      setAiTip(tip);
      setLoadingTip(false);
    }
  }, [goalData.name, goalData.targetAmount, goalData.monthlyContribution, goalData.aiCoachEnabled, goalData.category]);

  // debounce or just fetch when enabled/toggled
  useEffect(() => {
    if (goalData.aiCoachEnabled) {
      const timer = setTimeout(() => {
        fetchTip();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fetchTip, goalData.aiCoachEnabled]);

  const handleCreate = () => {
    onCreate(goalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="px-10 pt-10 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Goal Setup</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>

          {/* Stepper */}
          <div className="relative flex items-center justify-between px-2">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
            {/* Progress fill */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
              style={{ width: step === Step.CATEGORY ? '0%' : step === Step.TARGET ? '50%' : '100%' }}
            ></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= Step.CATEGORY ? 'bg-primary text-white shadow-lg shadow-teal-500/30' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > Step.CATEGORY ? <span className="material-icons-round text-lg">check</span> : '1'}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= Step.CATEGORY ? 'text-primary' : 'text-slate-400'}`}>Category</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= Step.TARGET ? 'bg-primary text-white shadow-lg shadow-teal-500/30' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > Step.TARGET ? <span className="material-icons-round text-lg">check</span> : '2'}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= Step.TARGET ? 'text-primary' : 'text-slate-400'}`}>Target</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= Step.TIMELINE ? 'bg-primary text-white shadow-lg shadow-teal-500/30' : 'bg-slate-100 text-slate-400'
                }`}
              >
                3
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= Step.TIMELINE ? 'text-primary' : 'text-slate-400'}`}>Timeline</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Configure Your Goal</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Give your goal a name and define your financial target.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Goal Name</label>
              <input 
                type="text" 
                value={goalData.name}
                onChange={(e) => setGoalData({...goalData, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white text-slate-900 dark:text-white font-medium transition-all"
                placeholder="e.g. New SUV Down Payment"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Target Amount</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors">$</span>
                <input 
                  type="number" 
                  value={goalData.targetAmount}
                  onChange={(e) => setGoalData({...goalData, targetAmount: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-10 pr-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white text-slate-900 dark:text-white font-bold transition-all"
                />
              </div>
            </div>
          </div>

          {/* Slider Section */}
          <div className="space-y-6 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Monthly Contribution Capacity</label>
              <span className="text-xl font-bold text-primary">${goalData.monthlyContribution.toLocaleString()}</span>
            </div>
            <div className="px-2">
              <input 
                type="range" 
                min="100" 
                max="5000" 
                step="50"
                value={goalData.monthlyContribution}
                onChange={(e) => setGoalData({...goalData, monthlyContribution: Number(e.target.value)})}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>$100</span>
                <span>$5,000</span>
              </div>
            </div>
          </div>

          {/* AI Coach Card */}
          <div className="bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/20 rounded-3xl p-6 glass-effect">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary shrink-0 border border-teal-50 dark:border-teal-900/10">
                <span className="material-symbols-outlined text-3xl font-bold">auto_awesome</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">AI Optimization & Socratic Coach</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={goalData.aiCoachEnabled}
                      onChange={() => setGoalData({...goalData, aiCoachEnabled: !goalData.aiCoachEnabled})}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 font-medium">
                  Allow the Socratic Coach to analyze your spending habits and suggest budget reallocations to reach this goal up to 25% faster.
                </p>
                <div className="flex items-center gap-3 py-3 px-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-teal-100/50 dark:border-teal-900/20 shadow-sm">
                  <span className="material-icons-round text-primary text-base">tips_and_updates</span>
                  <span className={`text-xs font-medium text-slate-500 dark:text-slate-400 italic transition-opacity duration-300 ${loadingTip ? 'opacity-50' : 'opacity-100'}`}>
                    {loadingTip ? 'Analyzing your habits...' : `"${aiTip}"`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <span className="material-icons-round text-lg">arrow_back</span>
            Back
          </button>
          <div className="flex items-center gap-6">
            <button className="px-6 py-4 font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Save as Draft</button>
            <button 
              onClick={handleCreate}
              className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-white font-bold shadow-2xl shadow-teal-500/30 hover:opacity-90 hover:scale-[1.02] transition-all active:scale-95"
            >
              Create Goal
              <span className="material-icons-round text-lg">rocket_launch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSetupModal;
