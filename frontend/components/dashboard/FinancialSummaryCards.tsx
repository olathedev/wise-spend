import React from "react";
import { Shield, ShoppingBag, Verified } from "lucide-react";
import StatCard from "./StatCard";
import SnapReceiptButton from "../receipt/SnapReceiptButton";

export default function FinancialSummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <div className="flex flex-col justify-center">
        <SnapReceiptButton />
      </div>
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
