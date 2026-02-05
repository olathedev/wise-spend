'use client';

import React, { useState, useEffect } from 'react';
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
  PlayCircle,
  Loader2,
  RefreshCw,
  CheckCircle2,
  X
} from 'lucide-react';
import QuizModal from './QuizModal';
import { getQuizzes, generateQuizzes, completeQuiz, deleteAllQuizzes, type Quiz } from '@/services/quizService';
import type { QuizQuestion } from './QuizModal';

// Icon mapping for concepts
const CONCEPT_ICONS: Record<string, React.ComponentType<any>> = {
  'Budgeting Basics': PieChart,
  'Emergency Fund': Shield,
  'Debt Management': CreditCard,
  'Investment Basics': TrendingUp,
  'Credit Score': DollarSign,
  'Savings Strategies': PiggyBank,
  'Financial Goal Setting': Target,
  'Expense Tracking': BarChart3,
  '50/30/20 Rule': PieChart,
  'Compound Growth': TrendingUp,
  'Tax-Advantaged Accounts': Building2,
  'Diversification': BarChart3,
  'Automated Savings': PiggyBank,
  'Debt Payoff Strategies': CreditCard,
  'Home Buying': Building2,
  'Retirement Planning': Target,
  'Small Expense Tracking': DollarSign,
  'Subscription Management': CreditCard,
  'Impulse Buying': TrendingDown,
  'Needs vs Wants': Lightbulb,
  'Expense Reduction': TrendingDown,
  'Advanced Budgeting': PieChart,
  'Wealth Building': TrendingUp,
  'Daily Spending Habits': BookOpen,
  'Recurring Expenses': CreditCard,
  'Financial Safety Net': Shield,
  'Down Payment Planning': Building2,
  'Long-term Investing': TrendingUp,
  'Income Planning': DollarSign,
};

const CONCEPT_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  'Budgeting Basics': { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  'Emergency Fund': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  'Debt Management': { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  'Investment Basics': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  'Credit Score': { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  'Savings Strategies': { color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
  'Financial Goal Setting': { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
  'Expense Tracking': { color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
};

export default function FinancialLiteracyCards() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  // Load quizzes on mount
  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      const data = await getQuizzes({ limit: 10 });
      setQuizzes(data.quizzes);
      setStats(data.stats);
    } catch (error: any) {
      console.error('Error loading quizzes:', error);
      // If user is not logged in, show empty state
      if (error.message?.includes('log in')) {
        setQuizzes([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuizzes = async () => {
    try {
      setIsGenerating(true);
      const data = await generateQuizzes(10);
      await loadQuizzes(); // Reload to get updated list
    } catch (error: any) {
      console.error('Error generating quizzes:', error);
      alert(error.message || 'Failed to generate quizzes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearAllQuizzes = async () => {
    if (!confirm('Are you sure you want to delete all your quizzes? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteAllQuizzes();
      await loadQuizzes(); // Reload to get updated list (should be empty)
      alert(`Successfully deleted ${result.deletedCount} quiz${result.deletedCount !== 1 ? 'zes' : ''}.`);
    } catch (error: any) {
      console.error('Error deleting quizzes:', error);
      alert(error.message || 'Failed to delete quizzes. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuizClick = (quiz: Quiz) => {
    if (quiz.isCompleted) {
      // Show completed quiz in read-only mode
      setSelectedQuiz(quiz);
      setIsQuizOpen(true);
      setQuizAnswers([]);
      setCurrentQuestionIndex(0);
    } else {
      // Start new quiz
      setSelectedQuiz(quiz);
      setIsQuizOpen(true);
      setQuizAnswers(new Array(quiz.questions.length).fill(-1));
      setCurrentQuestionIndex(0);
    }
  };

  const handleQuizComplete = async (answers: number[]) => {
    if (!selectedQuiz || selectedQuiz.isCompleted) return;

    try {
      await completeQuiz(selectedQuiz.id, answers);
      await loadQuizzes(); // Reload to update stats
      // Update selected quiz to show completion
      const updatedQuiz = quizzes.find(q => q.id === selectedQuiz.id);
      if (updatedQuiz) {
        setSelectedQuiz(updatedQuiz);
      }
    } catch (error: any) {
      console.error('Error completing quiz:', error);
      alert(error.message || 'Failed to save quiz results. Please try again.');
    }
  };

  const handleCloseQuiz = () => {
    setIsQuizOpen(false);
    setTimeout(() => {
      setSelectedQuiz(null);
      setQuizAnswers([]);
      setCurrentQuestionIndex(0);
    }, 300);
  };

  const getIconForConcept = (concept: string) => {
    return CONCEPT_ICONS[concept] || BookOpen;
  };

  const getColorsForConcept = (concept: string) => {
    return CONCEPT_COLORS[concept] || {
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-100'
    };
  };

  // Convert backend quiz questions to QuizModal format
  const convertQuizQuestions = (quiz: Quiz): QuizQuestion[] => {
    return quiz.questions.map((q, index) => ({
      id: index,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Financial Growth & Literacy</h3>
          <p className="text-sm text-slate-500">AI-curated personalized quizzes based on your spending</p>
        </div>
        <div className="flex items-center gap-3">
          {stats.total > 0 && (
            <div className="text-sm text-slate-600">
              <span className="font-semibold">{stats.completed}</span> completed •{' '}
              <span className="font-semibold">{stats.pending}</span> pending
            </div>
          )}
          {stats.total > 0 && (
            <button
              onClick={handleClearAllQuizzes}
              disabled={isDeleting || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <X size={16} />
                  <span>Clear All</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={handleGenerateQuizzes}
            disabled={isGenerating || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Generate Quizzes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 size={48} className="animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading your personalized quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <BookOpen size={48} className="text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-slate-900 mb-2">No quizzes yet</h4>
          <p className="text-slate-600 mb-6">
            Generate personalized quizzes based on your spending patterns and financial goals.
          </p>
          <button
            onClick={handleGenerateQuizzes}
            disabled={isGenerating}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Your First Quizzes'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => {
            const IconComponent = getIconForConcept(quiz.concept);
            const colors = getColorsForConcept(quiz.concept);
            
            return (
              <motion.div
                whileHover={{ y: -4 }}
                key={quiz.id}
                onClick={() => handleQuizClick(quiz)}
                className={`w-full h-44 rounded-2xl p-6 flex flex-col justify-between border ${colors.border} ${colors.bg} hover:shadow-lg transition-all cursor-pointer relative`}
              >
                {quiz.isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-xl bg-white/60 backdrop-blur-sm ${colors.color}`}>
                    <IconComponent size={20} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.color} bg-white/50 px-2 py-1 rounded-full`}>
                    {quiz.concept}
                  </span>
                </div>
                <div>
                  <h4 className={`text-base font-bold text-slate-900 mb-1`}>{quiz.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2 line-clamp-2">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-teal-600">
                      <PlayCircle size={14} />
                      <span>{quiz.isCompleted ? 'Review Quiz' : 'Start Learning'}</span>
                    </div>
                    {quiz.isCompleted && quiz.score !== undefined && (
                      <span className="text-xs font-bold text-emerald-600">
                        {quiz.score}% Score
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedQuiz && (
        <QuizModal
          isOpen={isQuizOpen}
          onClose={handleCloseQuiz}
          topicTitle={selectedQuiz.title}
          topicIcon={
            <div className={`p-2 rounded-xl bg-white/60 backdrop-blur-sm ${getColorsForConcept(selectedQuiz.concept).color}`}>
              {React.createElement(getIconForConcept(selectedQuiz.concept), { size: 24 })}
            </div>
          }
          questions={convertQuizQuestions(selectedQuiz)}
          isLoading={false}
          onComplete={selectedQuiz.isCompleted ? undefined : handleQuizComplete}
        />
      )}
    </div>
  );
}
