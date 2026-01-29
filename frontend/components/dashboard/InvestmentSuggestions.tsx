'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Building2, 
  Globe,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const INVESTMENT_SUGGESTIONS = [
  {
    id: 1,
    title: "S&P 500 Index Fund",
    type: "Stocks",
    risk: "Medium",
    return: "7-10% annually",
    description: "Broad market exposure to 500 largest US companies. Low fees, diversified, great for long-term growth.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  },
  {
    id: 2,
    title: "Total Stock Market ETF",
    type: "Stocks",
    risk: "Medium",
    return: "7-10% annually",
    description: "Diversified exposure to entire US stock market. Even more diversification than S&P 500.",
    icon: BarChart3,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  },
  {
    id: 3,
    title: "International Stock Fund",
    type: "Stocks",
    risk: "Medium-High",
    return: "6-9% annually",
    description: "Invest in companies outside the US. Reduces geographic risk and captures global growth.",
    icon: Globe,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  },
  {
    id: 4,
    title: "Bond Index Fund",
    type: "Bonds",
    risk: "Low-Medium",
    return: "3-5% annually",
    description: "Lower risk, provides stability and income. Good for balancing stock market volatility.",
    icon: Building2,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    minInvestment: "$1",
    timeHorizon: "3+ years"
  },
  {
    id: 5,
    title: "Real Estate Investment Trust (REIT)",
    type: "Real Estate",
    risk: "Medium",
    return: "5-8% annually",
    description: "Invest in real estate without buying property. Provides diversification and income through dividends.",
    icon: Building2,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  },
  {
    id: 6,
    title: "Target Date Retirement Fund",
    type: "Mixed",
    risk: "Varies",
    return: "6-8% annually",
    description: "Automatically adjusts asset allocation as you approach retirement. Set it and forget it.",
    icon: PieChart,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    minInvestment: "$1",
    timeHorizon: "10+ years"
  },
  {
    id: 7,
    title: "High-Yield Savings Account",
    type: "Cash",
    risk: "Very Low",
    return: "4-5% annually",
    description: "FDIC insured, liquid, no risk. Perfect for emergency fund or short-term goals.",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    minInvestment: "$0",
    timeHorizon: "Any"
  },
  {
    id: 8,
    title: "Dividend Growth Stocks",
    type: "Stocks",
    risk: "Medium",
    return: "7-9% annually",
    description: "Companies that consistently increase dividends. Provides income and growth potential.",
    icon: Sparkles,
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  }
];

export default function InvestmentSuggestions() {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h3 className="text-xl font-bold text-slate-900">AI Investment Suggestions</h3>
          <p className="text-sm text-slate-500">Personalized investment recommendations based on your profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INVESTMENT_SUGGESTIONS.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <motion.div
              whileHover={{ y: -4 }}
              key={item.id}
              className={`w-full rounded-2xl p-6 border ${item.border} ${item.bg} hover:shadow-sm transition-all`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-white/60 backdrop-blur-sm ${item.color}`}>
                  <IconComponent size={20} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color} bg-white/50 px-2 py-1 rounded-full`}>
                    {item.type}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.risk === 'Very Low' ? 'bg-green-100 text-green-700' :
                    item.risk === 'Low-Medium' ? 'bg-blue-100 text-blue-700' :
                    item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {item.risk} Risk
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className={`text-base font-bold text-slate-900 mb-2`}>{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/50">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-semibold">Expected Return:</span>
                    <span className="text-xs font-bold text-emerald-600">{item.return}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-semibold">Min Investment:</span>
                    <span className="text-xs font-semibold text-slate-700">{item.minInvestment}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-teal-600">
                  <span>Learn More</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs text-amber-800">
          <strong>Disclaimer:</strong> These are general investment suggestions for educational purposes. Always consult with a financial advisor before making investment decisions. Past performance does not guarantee future results. All investments carry risk of loss.
        </p>
      </div>
    </div>
  );
}
