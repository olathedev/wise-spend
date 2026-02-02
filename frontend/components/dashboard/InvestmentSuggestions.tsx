'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Building2, 
  Globe,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { getInvestmentOpportunities, getTopGainers } from '@/services/investmentService';

interface InvestmentOpportunity {
  symbol: string;
  name: string;
  type: string;
  price: number;
  changePercent: number;
  description: string;
  sector?: string;
}

const FALLBACK_SUGGESTIONS = [
  {
    symbol: "SPY",
    name: "S&P 500 Index Fund",
    type: "ETF",
    price: 0,
    changePercent: 0,
    description: "Broad market exposure to 500 largest US companies. Low fees, diversified, great for long-term growth.",
    risk: "Medium",
    return: "7-10% annually",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  },
  {
    symbol: "VTI",
    name: "Total Stock Market ETF",
    type: "ETF",
    price: 0,
    changePercent: 0,
    description: "Diversified exposure to entire US stock market. Even more diversification than S&P 500.",
    risk: "Medium",
    return: "7-10% annually",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  },
  {
    symbol: "VEA",
    name: "International Stock Fund",
    type: "ETF",
    price: 0,
    changePercent: 0,
    description: "Invest in companies outside the US. Reduces geographic risk and captures global growth.",
    risk: "Medium-High",
    return: "6-9% annually",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  },
  {
    symbol: "BND",
    name: "Bond Index Fund",
    type: "ETF",
    price: 0,
    changePercent: 0,
    description: "Lower risk, provides stability and income. Good for balancing stock market volatility.",
    risk: "Low-Medium",
    return: "3-5% annually",
    minInvestment: "$1",
    timeHorizon: "3+ years"
  },
  {
    symbol: "VNQ",
    name: "Real Estate Investment Trust (REIT)",
    type: "ETF",
    price: 0,
    changePercent: 0,
    description: "Invest in real estate without buying property. Provides diversification and income through dividends.",
    risk: "Medium",
    return: "5-8% annually",
    minInvestment: "$1",
    timeHorizon: "5+ years"
  },
];

const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'etf':
      return BarChart3;
    case 'stock':
      return TrendingUp;
    case 'bond':
      return Building2;
    case 'real estate':
      return Building2;
    default:
      return PieChart;
  }
};

const getColorClasses = (index: number, changePercent?: number) => {
  // Use neutral backgrounds with colored accents for better readability
  const accentColors = [
    { color: "text-emerald-600 dark:text-emerald-400", accent: "border-l-emerald-500" },
    { color: "text-blue-600 dark:text-blue-400", accent: "border-l-blue-500" },
    { color: "text-indigo-600 dark:text-indigo-400", accent: "border-l-indigo-500" },
    { color: "text-teal-600 dark:text-teal-400", accent: "border-l-teal-500" },
    { color: "text-purple-600 dark:text-purple-400", accent: "border-l-purple-500" },
    { color: "text-amber-600 dark:text-amber-400", accent: "border-l-amber-500" },
    { color: "text-green-600 dark:text-green-400", accent: "border-l-green-500" },
    { color: "text-pink-600 dark:text-pink-400", accent: "border-l-pink-500" },
  ];
  
  const baseColor = accentColors[index % accentColors.length];
  
  // If we have real data and it's negative, use red accent
  if (changePercent !== undefined && changePercent < 0) {
    return {
      color: "text-red-600 dark:text-red-400",
      accent: "border-l-red-500"
    };
  }
  
  return baseColor;
};

const getRiskLevel = (type: string, changePercent?: number): string => {
  if (type.toLowerCase() === 'etf' && changePercent !== undefined) {
    if (Math.abs(changePercent) < 1) return "Low";
    if (Math.abs(changePercent) < 3) return "Medium";
    return "Medium-High";
  }
  if (type.toLowerCase().includes('bond')) return "Low-Medium";
  if (type.toLowerCase().includes('real estate')) return "Medium";
  return "Medium";
};

export default function InvestmentSuggestions() {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOpportunities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to get real investment opportunities
        const realOpportunities = await getInvestmentOpportunities();
        
        if (realOpportunities.length > 0) {
          setOpportunities(realOpportunities);
        } else {
          // Fallback to top gainers
          const topGainers = await getTopGainers();
          if (topGainers.length > 0) {
            setOpportunities(topGainers.map(g => ({
              ...g,
              type: "Stock",
              description: `High-performing stock with ${g.changePercent.toFixed(2)}% gain today.`,
            })));
          } else {
            // Use fallback static data
            setOpportunities(FALLBACK_SUGGESTIONS);
          }
        }
      } catch (err) {
        console.error("Error loading investment opportunities:", err);
        setError("Unable to load real-time data. Showing general recommendations.");
        setOpportunities(FALLBACK_SUGGESTIONS);
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);
  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Real Investment Opportunities</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? "Loading real-time data..." : "Live market data from Alpha Vantage API"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Fetching real-time investment data...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((item, index) => {
            const IconComponent = getIconForType(item.type);
            const colorClasses = getColorClasses(index, item.changePercent);
            const risk = getRiskLevel(item.type, item.changePercent);
            const isPositive = item.changePercent >= 0;
            
            return (
              <motion.div
                whileHover={{ y: -4 }}
                key={item.symbol}
                className={`w-full rounded-2xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${colorClasses.accent} border-l-4 hover:shadow-lg transition-all`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-700 ${colorClasses.color}`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${colorClasses.color} bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full`}>
                      {item.type}
                    </span>
                    {item.changePercent !== undefined && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isPositive 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      risk === 'Very Low' || risk === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      risk === 'Low-Medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      risk === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    }`}>
                      {risk} Risk
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`text-base font-bold text-slate-900 dark:text-white`}>{item.name}</h4>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">({item.symbol})</span>
                  </div>
                  {item.price > 0 && (
                    <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      ${item.price.toFixed(2)}
                    </p>
                  )}
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  {item.sector && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      Sector: {item.sector}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col gap-1">
                    {item.changePercent !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Today's Change:</span>
                        <span className={`text-sm font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Min Investment:</span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">$1</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 cursor-pointer hover:underline">
                    <span>Learn More</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <p className="text-xs text-amber-800 dark:text-amber-200">
          <strong>Disclaimer:</strong> These are real-time investment opportunities for educational purposes. Always consult with a financial advisor before making investment decisions. Past performance does not guarantee future results. All investments carry risk of loss. Data provided by Alpha Vantage API.
        </p>
      </div>
    </div>
  );
}
