"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Target, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthCallbackHandler from "@/components/auth/AuthCallbackHandler";
import { saveOnboardingData } from "@/services/authService";

type FormData = {
  monthlyIncome: string;
  financialGoals: string[];
  coachPersonality: string;
};

const GOALS = [
  { id: "emergency", label: "Emergency Fund" },
  { id: "debt", label: "Pay off Debt" },
  { id: "home", label: "Save for Home" },
  { id: "wealth", label: "Build Wealth" },
  { id: "travel", label: "Travel & Fun" },
  { id: "invest", label: "Start Investing" },
  { id: "car", label: "Buy a Car" },
  { id: "retirement", label: "Retire Early" },
  { id: "business", label: "Start Business" },
  { id: "education", label: "Education" },
  { id: "wedding", label: "Wedding" },
  { id: "charity", label: "Charity/Giving" },
];

const COACH_PERSONAS = [
  {
    id: "drill_sergeant",
    label: "Drill Sergeant",
    desc: "Strict, aggressive accountability.",
    icon: Target,
    color: "bg-slate-900 text-white",
  },
  {
    id: "cheerleader",
    label: "Cheerleader",
    desc: "Positive reinforcement & celebration.",
    icon: Sparkles,
    color: "bg-pink-500 text-white",
  },
  {
    id: "analyst",
    label: "The Analyst",
    desc: "Pure logic, data-driven insights.",
    icon: TrendingUp,
    color: "bg-blue-600 text-white",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    monthlyIncome: string;
    financialGoals: string[];
    coachPersonality: string;
  }>({
    monthlyIncome: "",
    financialGoals: [],
    coachPersonality: "",
  });

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      try {
        await saveOnboardingData(formData);
        console.log("Onboarding Complete:", formData);
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to save onboarding data:", error);
        // You might want to show an error toast here
      }
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.monthlyIncome.length > 0;
    if (step === 2) return formData.financialGoals.length > 0;
    if (step === 3) return formData.coachPersonality.length > 0;
    return false;
  };

  const toggleGoal = (id: string) => {
    if (formData.financialGoals.includes(id)) {
      setFormData({
        ...formData,
        financialGoals: formData.financialGoals.filter((g) => g !== id),
      });
    } else {
      if (formData.financialGoals.length < 5) {
        setFormData({
          ...formData,
          financialGoals: [...formData.financialGoals, id],
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Handle backend API call after NextAuth sign-in */}
      <AuthCallbackHandler />

      <div className="w-full max-w-lg bg-white p-4 sm:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Income */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-left">
                <h2 className="text-3xl font-semibold text-slate-900">
                  Let's start with a baseline
                </h2>
                <p className="text-slate-500 mt-2">
                  What is your approximate monthly net income?
                </p>
              </div>

              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-900 text-2xl font-medium">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-4 text-3xl font-semibold text-left text-slate-900 border-b-2 border-gray-200 focus:border-teal-500 focus:ring-0 outline-none transition-all placeholder:text-gray-300 bg-transparent rounded-none"
                  value={formData.monthlyIncome}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyIncome: e.target.value })
                  }
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-left mb-6">
                <h2 className="text-3xl font-semibold text-slate-900">
                  What's your main focus?
                </h2>
                <p className="text-slate-500 mt-2">
                  Select up to 5 goals that matter most.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-xl border transition-all text-center text-sm font-medium ${
                      formData.financialGoals.includes(goal.id)
                        ? "border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500"
                        : "border-gray-100 hover:border-teal-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Persona */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-left mb-8">
                <h2 className="text-3xl font-semibold text-slate-900">
                  Pick your AI Coach
                </h2>
                <p className="text-slate-500 mt-2">
                  How should I keep you on track?
                </p>
              </div>

              <div className="space-y-3">
                {COACH_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() =>
                      setFormData({ ...formData, coachPersonality: persona.id })
                    }
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${
                      formData.coachPersonality === persona.id
                        ? "border-teal-500 bg-teal-50 shadow-md transform scale-[1.02]"
                        : "border-gray-100 hover:border-teal-200 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${persona.color}`}
                    >
                      <persona.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {persona.label}
                      </h3>
                      <p className="text-sm text-slate-500">{persona.desc}</p>
                    </div>
                    {formData.coachPersonality === persona.id && (
                      <div className="ml-auto text-teal-600">
                        <Check size={24} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          {/* Progress Bubbles at Bottom */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  s <= step ? "bg-teal-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all ${
              isStepValid()
                ? "bg-teal-500 hover:bg-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {step === 3 ? "Start Journey" : "Continue"}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
