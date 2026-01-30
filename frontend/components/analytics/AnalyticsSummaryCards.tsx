"use client";

import React from "react";
import SnapReceiptButton from "../receipt/SnapReceiptButton";

import { motion } from "framer-motion";

interface AnalyticsStatCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
}

const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  badgeColor,
  badgeBg,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="slick-glass p-6 rounded-3xl transition-all hover:shadow-xl hover:shadow-teal-500/5 group relative overflow-hidden min-w-[280px] md:min-w-0"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} shadow-sm group-hover:scale-110 transition-transform`}
        >
          <span className="material-icons-round text-xl">{icon}</span>
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-wider ${badgeColor} ${badgeBg} px-3 py-1 rounded-lg`}
        >
          {badge}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-black tracking-tight">
          {value}
        </h3>
      </div>
    </motion.div>
  );
};

export default function AnalyticsSummaryCards() {
  return (
    <div className="flex overflow-x-auto no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0">
      <div className="flex-none w-[280px] md:w-auto">
        <AnalyticsStatCard
          icon="bolt"
          iconBg="bg-orange-100/50 dark:bg-orange-900/20"
          iconColor="text-orange-600 dark:text-orange-400"
          label="Impulse Buy Frequency"
          value="8/month"
          badge="+12% vs last mo"
          badgeColor="text-red-600 dark:text-red-400"
          badgeBg="bg-red-50/50 dark:bg-red-900/10"
        />
      </div>
      <div className="flex-none w-[280px] md:w-auto">
        <AnalyticsStatCard
          icon="trending_up"
          iconBg="bg-teal-100/50 dark:bg-teal-900/20"
          iconColor="text-teal-600 dark:text-teal-400"
          label="Wise Score Trend"
          value="Rising"
          badge="+24 pts"
          badgeColor="text-teal-600 dark:text-teal-400"
          badgeBg="bg-teal-50/50 dark:bg-teal-900/10"
        />
      </div>
      <div className="flex-none w-[280px] md:w-auto">
        <AnalyticsStatCard
          icon="auto_renew"
          iconBg="bg-blue-100/50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
          label="Subscription Efficiency"
          value="94%"
          badge="Optimal"
          badgeColor="text-blue-600 dark:text-blue-400"
          badgeBg="bg-blue-50/50 dark:bg-blue-900/10"
        />
      </div>
      <div className="flex-none w-[280px] md:w-auto flex flex-col justify-center">
        <SnapReceiptButton />
      </div>
    </div>
  );
}
