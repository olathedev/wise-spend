'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  PieChart, 
  Target, 
  Shield, 
  DollarSign,
  BarChart3,
  PiggyBank,
  CreditCard,
  Building2,
  TrendingDown,
  BookOpen,
  PlayCircle
} from 'lucide-react';
import QuizModal from './QuizModal';
import { QUIZ_DATA } from './quizData';

const LITERACY_CARDS = [
  {
    id: 1,
    title: "The 50/30/20 Rule",
    category: "Smart Tip",
    desc: "Allocate your income: 50% Needs, 30% Wants, 20% Savings.",
    icon: PieChart,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100"
  },
  {
    id: 2,
    title: "Compound Growth",
    category: "Wealth",
    desc: "Investing $500/mo at 7% return can grow to $85k in 10 years.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    id: 3,
    title: "Inflation vs. Cash",
    category: "Alert",
    desc: "Holding too much cash? Inflation eats 3% of its value yearly.",
    icon: TrendingDown,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100"
  },
  {
    id: 4,
    title: "Emergency Fund",
    category: "Basics",
    desc: "Aim for 3-6 months of expenses in a high-yield savings account.",
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    id: 5,
    title: "Debt Snowball Method",
    category: "Strategy",
    desc: "Pay off smallest debts first for quick wins, then roll payments into larger debts.",
    icon: CreditCard,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100"
  },
  {
    id: 6,
    title: "Diversification",
    category: "Investing",
    desc: "Don't put all eggs in one basket. Spread investments across stocks, bonds, and real estate.",
    icon: BarChart3,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100"
  },
  {
    id: 7,
    title: "Automated Savings",
    category: "Habit",
    desc: "Set up automatic transfers to savings. Pay yourself first - even $50/month adds up.",
    icon: PiggyBank,
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100"
  },
  {
    id: 8,
    title: "Tax-Advantaged Accounts",
    category: "Wealth",
    desc: "Maximize 401(k) and IRA contributions. Employer matches are free money.",
    icon: Building2,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100"
  },
  {
    id: 9,
    title: "Credit Score Basics",
    category: "Basics",
    desc: "Pay bills on time, keep credit utilization below 30%, and maintain a long credit history.",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100"
  },
  {
    id: 10,
    title: "ROI Calculation",
    category: "Investing",
    desc: "Return on Investment = (Gain - Cost) / Cost × 100. Aim for ROI above inflation rate.",
    icon: Target,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100"
  },
  {
    id: 11,
    title: "Budgeting Apps",
    category: "Tool",
    desc: "Track every expense for 30 days to identify spending patterns. Knowledge is the first step.",
    icon: BookOpen,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100"
  },
  {
    id: 12,
    title: "Financial Goals",
    category: "Planning",
    desc: "Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound. Review quarterly.",
    icon: Lightbulb,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100"
  }
];

export default function FinancialLiteracyCards() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
    setIsQuizOpen(true);
  };

  const handleCloseQuiz = () => {
    setIsQuizOpen(false);
    setTimeout(() => {
      setSelectedCard(null);
    }, 300);
  };

  const selectedCardData = selectedCard ? LITERACY_CARDS.find(card => card.id === selectedCard) : null;
  const quizQuestions = selectedCard && QUIZ_DATA[selectedCard] ? QUIZ_DATA[selectedCard] : [];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Financial Growth & Literacy</h3>
          <p className="text-sm text-slate-500">AI-curated financial insights for you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LITERACY_CARDS.map((item) => {
          const IconComponent = item.icon;
          const hasQuiz = QUIZ_DATA[item.id] && QUIZ_DATA[item.id].length > 0;
          
          return (
            <motion.div
              whileHover={{ y: -4 }}
              key={item.id}
              onClick={() => hasQuiz && handleCardClick(item.id)}
              className={`w-full h-44 rounded-2xl p-6 flex flex-col justify-between border ${item.border} ${item.bg} hover:shadow-sm transition-all ${
                hasQuiz ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-xl bg-white/60 backdrop-blur-sm ${item.color}`}>
                  <IconComponent size={20} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color} bg-white/50 px-2 py-1 rounded-full`}>
                  {item.category}
                </span>
              </div>
              <div>
                <h4 className={`text-base font-bold text-slate-900 mb-1`}>{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2">
                  {item.desc}
                </p>
                {hasQuiz && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 mt-2">
                    <PlayCircle size={14} />
                    <span>Start Learning</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedCardData && (
        <QuizModal
          isOpen={isQuizOpen}
          onClose={handleCloseQuiz}
          topicTitle={selectedCardData.title}
          topicIcon={
            <div className={`p-2 rounded-xl bg-white/60 backdrop-blur-sm ${selectedCardData.color}`}>
              {React.createElement(selectedCardData.icon, { size: 24 })}
            </div>
          }
          questions={quizQuestions}
        />
      )}
    </div>
  );
}
