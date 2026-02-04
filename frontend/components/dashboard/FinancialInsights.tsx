"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  PieChart,
  ArrowRight,
  BookOpen,
  Target,
} from "lucide-react";
import Link from "next/link";
import FinancialTipsModal from "./FinancialTipsModal";
import { generateFinancialTips, FinancialTip } from "@/services/financialTipsService";

const INSIGHTS = [
  {
    id: 1,
    title: "The 50/30/20 Rule",
    category: "Smart Tip",
    desc: "Allocate your income: 50% Needs, 30% Wants, 20% Savings.",
    icon: PieChart,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    id: 2,
    title: "Compound Growth",
    category: "Wealth",
    desc: "Investing $500/mo at 7% return can grow to $85k in 10 years.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    id: 3,
    title: "Inflation vs. Cash",
    category: "Alert",
    desc: "Holding too much cash? Inflation eats 3% of its value yearly.",
    icon: Target,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    id: 4,
    title: "Emergency Fund",
    category: "Basics",
    desc: "Aim for 3-6 months of expenses in a high-yield savings account.",
    icon: Lightbulb,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
];

export default function FinancialInsights() {
  const ref = useRef(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [tips, setTips] = useState<FinancialTip[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = async (topic: string, category?: string) => {
    setSelectedTopic(topic);
    setIsModalOpen(true);
    setLoadingTips(true);
    setTips([]);

    try {
      const generatedTips = await generateFinancialTips(topic, category);
      setTips(generatedTips);
    } catch (error) {
      console.error("Failed to generate tips:", error);
      // Tips will fall back to mock tips in the service
      setTips([]);
    } finally {
      setLoadingTips(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
    setTips([]);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 px-1 gap-4 sm:gap-0">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
            Financial Insights
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            AI-curated financial insights for you
          </p>
        </div>
        <Link
          href="/dashboard/grow"
          className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors bg-teal-50 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg sm:rounded-none"
        >
          See all lessons <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CTA Card */}
        <Link
          href="/dashboard/grow"
          className="w-full h-44 rounded-2xl bg-slate-900 p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-teal-500/30"></div>
          <div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 text-white backdrop-blur-sm">
              <BookOpen size={20} />
            </div>
            <h4 className="text-lg font-bold text-white leading-tight">
              Master Your Money
            </h4>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-3">
              Level up your financial IQ today.
            </p>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-teal-500 rounded-full"></div>
            </div>
          </div>
        </Link>

        {INSIGHTS.slice(0, 3).map((item) => (
          <motion.div
            whileHover={{ y: -4 }}
            key={item.id}
            onClick={() => handleCardClick(item.title, item.category)}
            className={`w-full h-44 rounded-2xl p-6 flex flex-col justify-between border ${item.border} ${item.bg} hover:shadow-sm transition-all cursor-pointer`}
          >
            <div className="flex justify-between items-start">
              <div
                className={`p-2 rounded-xl bg-white/60 backdrop-blur-sm ${item.color}`}
              >
                <item.icon size={20} />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${item.color} bg-white/50 px-2 py-1 rounded-full`}
              >
                {item.category}
              </span>
            </div>
            <div>
              <h4 className={`text-base font-bold text-slate-900 mb-1`}>
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <FinancialTipsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        topic={selectedTopic || ""}
        tips={tips}
        loading={loadingTips}
      />
    </div>
  );
}
