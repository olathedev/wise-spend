"use client";

import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userFirstName = userName.split(" ")[0];
  const userImage =
    session?.user?.image ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(userName) +
      "&background=random";

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back,{" "}
          <span className="text-primary italic">{userFirstName}</span>
        </h2>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          Your financial vision is{" "}
          <span className="text-teal-600/80">crystal clear</span> today.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="hidden md:flex items-center gap-6"
      >
        <button className="relative p-2.5 text-slate-400 hover:text-primary hover:bg-teal-50 rounded-full transition-all group">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full font-bold border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-1.5 pr-5 rounded-full border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="relative">
            <img
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
              src={userImage}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">
              {userName}
            </p>
            <p className="text-[10px] text-teal-600/70 uppercase tracking-widest font-black">
              Premium
            </p>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
