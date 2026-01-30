"use client";

import React from "react";
import Image from "next/image";
import { Menu, Bell } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenSidebar }) => {
  return (
    <div className="md:hidden flex items-center justify-between p-4 slick-glass sticky top-0 z-40 border-b border-gray-100/50">
      <div className="flex items-center gap-2">
        <div className="p-1 bg-gradient-to-br from-teal-500 to-emerald-400 rounded-lg">
          <Image
            src="/logo.jpeg"
            alt="WiseSpend Logo"
            width={28}
            height={28}
            className="rounded-md"
          />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          WiseSpend
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-8 h-8 rounded-full border-2 border-teal-500/20 overflow-hidden shadow-sm">
          <img
            alt="User avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5l09NzMqhL2raDQElTcQLGvb3-JPyUfS7cufyfvmqFBOsw6BhZrGWoWnfwhv95H5Uf0bwusqGxG3448_WMidHXBeXn0k4q3qaerTk7IDT-V279QMo5RDAupedrNa8ALuStVB20Vy9Zl_T2c8P7n1AXQVoCcGqoln4j7YJ1Tlf7pbHawH8iUdDRbuF95qkM8P3zZgMdXCjW23xcQN_djjKVpPq7tOyzWPB84Sq5U3E0JFVkKhnGNJYjE6UYA6QZaXPZ2yJpeLERHg"
          />
        </div>

        <button
          onClick={onOpenSidebar}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
        >
          <Menu size={22} />
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
