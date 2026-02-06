"use client";

import React, { useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import WeeklyCheckInModal from "./WeeklyCheckInModal";

interface WeeklyCheckInBannerProps {
  /** Day of week for check-in (0 = Sunday). If null, show every day. */
  checkInDay?: number | null;
  /** Optional: show only if user has a commitment (for mid-week accountability) */
  showAccountabilityHint?: boolean;
}

export default function WeeklyCheckInBanner({
  checkInDay = 0,
  showAccountabilityHint = false,
}: WeeklyCheckInBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date().getDay();
  const isCheckInDay = checkInDay == null || today === checkInDay;

  if (!isCheckInDay && !showAccountabilityHint) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200 dark:border-teal-800 hover:from-teal-500/20 hover:to-emerald-500/20 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-black">
                {isCheckInDay ? "Your weekly check-in is ready" : "Check in on your commitment"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isCheckInDay
                  ? "5-minute reflection + commit to one micro-action"
                  : "See how you're doing with this week's goal"}
              </p>
            </div>
          </div>
          <ChevronRight
            size={20}
            className="text-slate-400 group-hover:text-teal-500 transition-colors"
          />
        </div>
      </button>

      <WeeklyCheckInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </>
  );
}
