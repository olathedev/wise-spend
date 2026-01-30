import React from "react";
import { Goal } from "../types";
import ProgressRing from "./ProgressRing";

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <ProgressRing progress={progress} />
        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 px-2 py-1 rounded-lg flex items-center gap-1 uppercase">
          <span className="material-icons-round text-xs">auto_awesome</span>
          AI: {goal.aiStatus}
        </span>
      </div>

      <h4 className="text-base sm:text-lg font-bold text-black dark:text-dark">
        {goal.name}
      </h4>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
        {goal.description}
      </p>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Current / Target
          </p>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-black">
            ${goal.currentAmount.toLocaleString()}
            <span className="text-slate-400 font-medium">
              {" "}
              / ${goal.targetAmount.toLocaleString()}
            </span>
          </p>
        </div>
        <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:text-primary transition-colors text-slate-400">
          <span className="material-icons-round">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
