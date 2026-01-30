import React from "react";
import { Shield, ShoppingBag, Verified } from "lucide-react";
import StatCard from "./StatCard";
import SnapReceiptButton from "../receipt/SnapReceiptButton";

export default function FinancialSummaryCards() {
  return (
    <div className="flex overflow-x-auto no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0">
      <div className="flex-none w-[280px] md:w-auto">
        <StatCard
          icon={<Shield size={24} className="text-teal-600" />}
          label="Emergency Fund"
          value="$12,450.00"
          trend="+4.2%"
          trendType="positive"
        />
      </div>
      <div className="flex-none w-[280px] md:w-auto">
        <StatCard
          icon={<ShoppingBag size={24} className="text-blue-600" />}
          label="Monthly Spending"
          value="$2,180.40"
          trend="82% of budget"
          trendType="neutral"
        />
      </div>
      <div className="flex-none w-[280px] md:w-auto">
        <StatCard
          icon={<Verified size={24} className="text-teal-600" />}
          label="Wise Score"
          value="842"
          trend="Top 5%"
          trendType="positive"
        />
      </div>
      <div className="flex-none w-[280px] md:w-auto flex flex-col justify-center">
        <SnapReceiptButton />
      </div>
    </div>
  );
}
