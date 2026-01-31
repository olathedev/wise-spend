"use client";

import React from "react";
import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { useSession } from "next-auth/react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenSidebar }) => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userImage =
    session?.user?.image ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(userName) +
      "&background=random";

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
            alt={userName}
            className="w-full h-full object-cover"
            src={userImage}
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
