"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import FloatingActionButton from "@/components/layout/FloatingActionButton";
import MobileHeader from "@/components/layout/MobileHeader";
import AICoachModal from "@/components/goals/AICoachModal";
import DailyAssessmentPopup from "@/components/assessment/DailyAssessmentPopup";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const pathname = usePathname();
  const isGrowPage = pathname === "/dashboard/grow";

  return (
    <div className="flex bg-white flex-col md:flex-row h-screen overflow-hidden">
      <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto smooth-scroll bg-background-light dark:bg-background-dark p-4 md:p-8 pb-20">
        {children}
      </main>

      <FloatingActionButton
        onClick={() => setIsAiCoachOpen(true)}
        className={isGrowPage ? "lg:hidden" : ""}
      />

      <AICoachModal
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
      />

      <DailyAssessmentPopup />
    </div>
  );
}
