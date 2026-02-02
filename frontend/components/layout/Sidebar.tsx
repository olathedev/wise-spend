"use client";

import React from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { NAVIGATION_ITEMS } from "../constants";
import { AppView } from "../types";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { logout } from "@/services/authService";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active view from pathname
  const getActiveView = (): AppView => {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname.startsWith("/dashboard/transactions")) return "transactions";
    if (pathname.startsWith("/dashboard/analytics")) return "analytics";
    if (pathname.startsWith("/dashboard/goals")) return "goals";
    if (pathname.startsWith("/dashboard/grow")) return "grow";
    if (pathname.startsWith("/dashboard/ai-coach")) return "ai-coach";
    return "dashboard";
  };

  const activeView = getActiveView();

  const handleViewChange = (view: AppView) => {
    const item = NAVIGATION_ITEMS.find((nav) => nav.id === view);
    if (item) {
      router.push(item.href);
      if (onClose) onClose();
    }
  };

  const handleSignOut = async () => {
    logout();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div
        className={`
        fixed md:static inset-y-0 left-0 w-64 h-full bg-white border-r border-gray-100 flex flex-col p-6 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between gap-2 mb-10 px-2">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="WiseSpend Logo"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-bold text-gray-800">WiseSpend</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id as AppView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id
                  ? "bg-gradient-to-r from-teal-500 to-emerald-400 text-white shadow-lg shadow-teal-100"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
