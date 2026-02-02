"use client";

import React, { useState } from "react";
import { GOALS_LIST } from "./constants";

interface AddGoalModalProps {
  currentGoalIds: string[];
  onClose: () => void;
  onAdd: (newIds: string[]) => Promise<void>;
}

export default function AddGoalModal({
  currentGoalIds,
  onClose,
  onAdd,
}: AddGoalModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = GOALS_LIST.filter((g) => !currentGoalIds.includes(g.id));
  const canAddMore = (currentGoalIds.length + selected.length) <= 5;

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (canAddMore) {
      setSelected([...selected, id]);
    }
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await onAdd(selected);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add goals");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Add goal
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            aria-label="Close"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Choose goals to add (max 5 total). You already have{" "}
            {currentGoalIds.length}.
          </p>
          {available.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300 py-4">
              You&apos;ve already added all available goals.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {available.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggle(goal.id)}
                  disabled={
                    !selected.includes(goal.id) && !canAddMore
                  }
                  className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                    selected.includes(goal.id)
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-200 ring-1 ring-teal-500"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-300 dark:hover:border-teal-700 disabled:opacity-50"
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={selected.length === 0 || saving}
            className="px-4 py-2 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 disabled:opacity-50"
          >
            {saving ? "Adding…" : `Add ${selected.length} goal${selected.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
