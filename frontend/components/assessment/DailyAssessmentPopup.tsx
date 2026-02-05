"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Flame, SkipForward } from "lucide-react";
import QuizModal from "@/components/dashboard/QuizModal";
import { QUIZ_DATA } from "@/components/dashboard/quizData";
import {
  getDailyAssessmentStatus,
  recordDailyAssessmentComplete,
  recordDailyAssessmentSkip,
} from "@/services/dailyAssessmentService";
import type { QuizQuestion } from "@/components/dashboard/QuizModal";

const DAILY_TOPICS = [
  { id: 1, title: "The 50/30/20 Rule", emoji: "📊" },
  { id: 2, title: "Compound Growth", emoji: "📈" },
  { id: 3, title: "Inflation vs. Cash", emoji: "💵" },
  { id: 4, title: "Emergency Fund", emoji: "🛡️" },
  { id: 5, title: "Debt Snowball", emoji: "⚡" },
  { id: 6, title: "Diversification", emoji: "🌐" },
  { id: 7, title: "Automated Savings", emoji: "🐷" },
  { id: 8, title: "Tax-Advantaged Accounts", emoji: "🏦" },
  { id: 9, title: "Credit Score Basics", emoji: "📋" },
  { id: 10, title: "ROI Calculation", emoji: "🎯" },
  { id: 11, title: "Budgeting Apps", emoji: "📱" },
  { id: 12, title: "Financial Goals", emoji: "🎯" },
];

function getTopicForToday() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (24 * 60 * 60 * 1000)
  );
  const index = dayOfYear % DAILY_TOPICS.length;
  return DAILY_TOPICS[index];
}

export default function DailyAssessmentPopup() {
  const [shouldShow, setShouldShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const check = async () => {
      try {
        const status = await getDailyAssessmentStatus();
        setShouldShow(status.shouldShow);
      } catch {
        setShouldShow(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  const topic = getTopicForToday();
  const topicQuestions = QUIZ_DATA[topic.id] ?? [];
  const dailyQuestions = topicQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((q, i) => ({ ...q, id: i + 1 }));

  const handleStart = () => {
    setQuestions(dailyQuestions);
    setIsQuizOpen(true);
  };

  const handleSkip = async () => {
    try {
      await recordDailyAssessmentSkip();
      setShouldShow(false);
    } catch {
      // Still close on error
      setShouldShow(false);
    }
  };

  const handleQuizComplete = async (score: number, total: number) => {
    const scorePct = total > 0 ? Math.round((score / total) * 100) : 0;
    try {
      await recordDailyAssessmentComplete(scorePct);
    } catch {
      // Ignore
    }
    setIsQuizOpen(false);
    setShouldShow(false);
  };

  const handleQuizClose = () => {
    setIsQuizOpen(false);
    // Don't setShouldShow false - they might have closed without finishing
    // Only complete/skip records the action
  };

  if (loading || !shouldShow) return null;

  return (
    <>
      {!isQuizOpen && (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={handleSkip} aria-hidden />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-teal-600 dark:text-teal-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Daily Financial Quiz
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Today&apos;s topic: <strong>{topic.emoji} {topic.title}</strong>
                <br />
                Take 3 quick questions to keep your streak going!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleStart}
                  className="px-6 py-3 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Flame size={18} />
                  Take Quiz
                </button>
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <SkipForward size={18} />
                  Skip for today
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      )}

      {isQuizOpen && questions.length > 0 && (
        <DailyQuizWrapper
          isOpen={isQuizOpen}
          onClose={handleQuizClose}
          onComplete={handleQuizComplete}
          questions={questions}
          topicTitle={topic.title}
        />
      )}
    </>
  );
}

interface DailyQuizWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
  questions: QuizQuestion[];
  topicTitle: string;
}

function DailyQuizWrapper({
  isOpen,
  onClose,
  onComplete,
  questions,
  topicTitle,
}: DailyQuizWrapperProps) {
  return (
    <QuizModal
      isOpen={isOpen}
      onClose={onClose}
      topicTitle={topicTitle}
      topicIcon={
        <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/30">
          <BookOpen size={24} className="text-teal-600 dark:text-teal-400" />
        </div>
      }
      questions={questions}
      onComplete={onComplete}
    />
  );
}
