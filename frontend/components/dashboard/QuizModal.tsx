'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Trophy, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  topicIcon: React.ReactNode;
  questions: QuizQuestion[];
}

export default function QuizModal({ isOpen, onClose, topicTitle, topicIcon, questions }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Shuffle questions and take 10 random ones
  const shuffledQuestions = React.useMemo(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [questions]);

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      setAnsweredQuestions([]);
      setIsComplete(false);
      setHasStarted(false);
    }
  }, [isOpen]);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, isCorrect]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setHasStarted(false);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setScore(0);
      setAnsweredQuestions([]);
      setIsComplete(false);
    }, 300);
  };

  if (!isOpen) return null;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showExplanation ? 1 : 0)) / shuffledQuestions.length) * 100;
  const scorePercentage = Math.round((score / shuffledQuestions.length) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {topicIcon}
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{topicTitle}</h2>
                  <p className="text-sm text-slate-500">Financial Literacy Quiz</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!hasStarted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Learn?</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Test your knowledge with 10 questions about {topicTitle}. 
                    Learn as you go and track your progress!
                  </p>
                  <button
                    onClick={handleStart}
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105"
                  >
                    Start Learning
                  </button>
                </div>
              ) : !isComplete ? (
                <div>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-600">
                        Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
                      </span>
                      <span className="text-sm font-bold text-teal-600">Score: {score}/{shuffledQuestions.length}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                      {currentQuestion.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestion.correctAnswer;
                        const showResult = showExplanation;

                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showExplanation}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              showResult
                                ? isCorrect
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : isSelected
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-slate-200 bg-white'
                                : isSelected
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50'
                            } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900">{option}</span>
                              {showResult && isCorrect && (
                                <CheckCircle2 size={20} className="text-emerald-600" />
                              )}
                              {showResult && isSelected && !isCorrect && (
                                <XCircle size={20} className="text-red-600" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-xl ${
                          selectedAnswer === currentQuestion.correctAnswer
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-amber-50 border border-amber-200'
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-900 mb-2">
                          {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                        </p>
                        <p className="text-sm text-slate-700">{currentQuestion.explanation}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Trophy size={48} className="text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h3>
                  <div className="mb-8">
                    <div className="text-5xl font-bold text-teal-600 mb-2">
                      {score}/{shuffledQuestions.length}
                    </div>
                    <div className="text-xl font-semibold text-slate-600">
                      {scorePercentage}% Score
                    </div>
                    <div className="mt-4">
                      {scorePercentage >= 80 ? (
                        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                          Excellent! 🌟
                        </span>
                      ) : scorePercentage >= 60 ? (
                        <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-bold">
                          Good Job! 👍
                        </span>
                      ) : (
                        <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-bold">
                          Keep Learning! 📚
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-8">
                    You've completed the {topicTitle} quiz. Great work on expanding your financial knowledge!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {hasStarted && !isComplete && (
              <div className="p-6 border-t border-slate-200 flex justify-end">
                {!showExplanation ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </button>
                )}
              </div>
            )}

            {isComplete && (
              <div className="p-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
