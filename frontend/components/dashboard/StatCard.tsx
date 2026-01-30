"use client";

import React from "react";
import { StatCardProps } from "../types";
import { motion } from "framer-motion";

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  trend,
  trendType,
}) => {
  const getTrendStyles = () => {
    switch (trendType) {
      case "positive":
        return "text-emerald-500 bg-emerald-50/50";
      case "negative":
        return "text-red-500 bg-red-50/50";
      default:
        return "text-teal-600 bg-teal-50/50";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="slick-glass p-4 md:p-5 rounded-3xl min-w-0 transition-all hover:shadow-xl hover:shadow-teal-500/5 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-700/50 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getTrendStyles()}`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black mb-1 uppercase tracking-widest leading-none">
          {label}
        </p>
        <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-black tracking-tight">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
