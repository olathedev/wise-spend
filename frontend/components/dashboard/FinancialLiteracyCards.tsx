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
} from 'lucide-react';
import QuizModal from './QuizModal';
import { QUIZ_DATA } from './quizData';
import { getQuizzes, generateQuizzes, completeQuiz, type Quiz } from '@/services/quizService';
import type { QuizQuestion } from './QuizModal';

const LITERACY_TOPICS = [
  { id: 1, title: 'The 50/30/20 Rule', emoji: '📊' },
  { id: 2, title: 'Compound Growth', emoji: '📈' },
  { id: 3, title: 'Inflation vs. Cash', emoji: '💵' },
  { id: 4, title: 'Emergency Fund', emoji: '🛡️' },
  { id: 5, title: 'Debt Snowball', emoji: '⚡' },
  { id: 6, title: 'Diversification', emoji: '🌐' },
  { id: 7, title: 'Automated Savings', emoji: '🐷' },
  { id: 8, title: 'Tax-Advantaged Accounts', emoji: '🏦' },
  { id: 9, title: 'Credit Score Basics', emoji: '📋' },
  { id: 10, title: 'ROI Calculation', emoji: '🎯' },
  { id: 11, title: 'Budgeting Apps', emoji: '📱' },
  { id: 12, title: 'Financial Goals', emoji: '🎯' },
];

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
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<typeof LITERACY_TOPICS[0] | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [topicQuestions, setTopicQuestions] = useState<QuizQuestion[]>([]);

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
      const data = await generateQuizzes(5); // Generate 5 quizzes (5 questions each)
      await loadQuizzes(); // Reload to get updated list
    } catch (error: any) {
      console.error('Error generating quizzes:', error);
      alert(error.message || 'Failed to generate quizzes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTopicClick = (topic: typeof LITERACY_TOPICS[0]) => {
    const rawQuestions = QUIZ_DATA[topic.id] ?? [];
    const questions = rawQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((q, i) => ({ ...q, id: i }));
    if (questions.length === 0) return;
    setSelectedTopic(topic);
    setSelectedQuiz(null);
    setQuizAnswers(new Array(questions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setIsQuizOpen(true);
    setTopicQuestions(questions);
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
      setSelectedTopic(null);
      setTopicQuestions([]);
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
    return quiz.questions.map((q, index) => {
      // Ensure correctAnswer is valid (0-3)
      const correctAnswer = typeof q.correctAnswer === 'number' && 
                            q.correctAnswer >= 0 && 
                            q.correctAnswer <= 3 
                            ? q.correctAnswer 
                            : 0;
      
      return {
        id: index,
        question: q.question,
        options: q.options || [],
        correctAnswer,
        explanation: q.explanation || 'No explanation provided.',
      };
    });
  };

  const getTopicColors = (id: number) => {
    const palettes = [
      { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
      { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
      { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
      { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
      { color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
      { color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    ];
    return palettes[(id - 1) % palettes.length];
  };

  return (
    <div className="mb-8">
      <div className="mb-6 px-1">
        <h3 className="text-xl font-bold text-slate-900">Financial Growth & Literacy</h3>
        <p className="text-sm text-slate-500">Click any topic to start learning — no setup required</p>
      </div>

      {/* Topic cards - single click to see questions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        {LITERACY_TOPICS.map((topic) => {
          const colors = getTopicColors(topic.id);
          const questionCount = (QUIZ_DATA[topic.id] ?? []).length;
          return (
            <motion.div
              whileHover={{ y: -4 }}
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className={`rounded-2xl p-5 flex flex-col justify-between border ${colors.border} ${colors.bg} hover:shadow-lg transition-all cursor-pointer min-h-[120px]`}
            >
              <span className="text-2xl mb-1">{topic.emoji}</span>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{topic.title}</h4>
              <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 mt-2">
                <PlayCircle size={14} />
                <span>{questionCount} questions</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Personalized Quizzes (optional) */}
      <div className="border-t border-slate-200 pt-8">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h4 className="text-lg font-bold text-slate-900">AI Personalized Quizzes</h4>
            <p className="text-sm text-slate-500">Custom quizzes based on your spending</p>
          </div>
          <div className="flex items-center gap-3">
            {stats.total > 0 && (
              <div className="text-sm text-slate-600">
                <span className="font-semibold">{stats.completed}</span> completed •{' '}
                <span className="font-semibold">{stats.pending}</span> pending
              </div>
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
          <div className="text-center py-8">
            <Loader2 size={32} className="animate-spin text-teal-500 mx-auto" />
          </div>
        ) : quizzes.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">
            Generate AI quizzes tailored to your spending patterns.
          </p>
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
                    <h4 className="text-base font-bold text-slate-900 mb-1">{quiz.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2 line-clamp-2">
                      {quiz.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs font-semibold text-teal-600">
                        <PlayCircle size={14} />
                        <span>{quiz.isCompleted ? 'Review Quiz' : 'Start Learning'}</span>
                      </div>
                      {quiz.isCompleted && quiz.score !== undefined && (
                        <span className="text-xs font-bold text-emerald-600">{quiz.score}% Score</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* QuizModal - for topic-based (autoStart) or AI-generated quizzes */}
      {selectedTopic && topicQuestions.length > 0 && (
        <QuizModal
          isOpen={isQuizOpen}
          onClose={handleCloseQuiz}
          topicTitle={selectedTopic.title}
          topicIcon={
            <div className={`p-2 rounded-xl bg-teal-100 ${getTopicColors(selectedTopic.id).color}`}>
              <BookOpen size={24} />
            </div>
          }
          questions={topicQuestions}
          isLoading={false}
          autoStart
          onComplete={undefined}
        />
      )}
      {selectedQuiz && !selectedTopic && (
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
          autoStart
          onComplete={selectedQuiz.isCompleted ? undefined : handleQuizComplete}
        />
      )}
    </div>
  );
}
