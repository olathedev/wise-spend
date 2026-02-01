"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Shield, ShoppingBag, Verified } from "lucide-react";
import StatCard from "./StatCard";
import ReceiptSnapModal from "../receipt/ReceiptSnapModal";

export default function FinancialSummaryCards() {
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <div className="flex flex-col justify-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setReceiptModalOpen(true)}
          className="w-full h-full min-h-[120px] md:min-h-[140px] flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
            <Camera size={28} />
          </div>
          <div className="text-center relative z-10">
            <p className="text-xs md:text-sm font-black uppercase tracking-widest leading-none mb-1">
              Snap Receipt
            </p>
            <p className="text-[10px] text-white/80 font-medium tracking-wide">
              Add New Expense
            </p>
          </div>
        </motion.button>
      </div>
      <ReceiptSnapModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />
      <div>
        <StatCard
          icon={<Shield size={24} className="text-teal-600" />}
          label="Emergency Fund"
          value="$12,450.00"
          trend="+4.2%"
          trendType="positive"
        />
      </div>
      <div>
        <StatCard
          icon={<ShoppingBag size={24} className="text-blue-600" />}
          label="Monthly Spending"
          value="$2,180.40"
          trend="82% of budget"
          trendType="neutral"
        />
      </div>
      <div>
        <StatCard
          icon={<Verified size={24} className="text-teal-600" />}
          label="Wise Score"
          value="842"
          trend="Top 5%"
          trendType="positive"
        />
      </div>
    </div>
  );
}
