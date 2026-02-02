"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CreditCard, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <main className="relative md:h-screen md:overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32 px-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] -z-10"></div>

      <section className="max-w-7xl mx-auto text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-yellow-400 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-6"
        >
          Spend Smarter
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-[7vw] xl:text-[6vw] font-[1000] leading-[1] md:leading-[0.9] tracking-[-0.05em] uppercase mb-10 md:mb-12 italic"
        >
          See What Your Spending{" "}
          <span className="text-white block md:inline">Costs Your Goals</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-16 md:mb-24"
        >
          <Link
            href="/auth/signin"
            className="bg-yellow-400 text-black px-8 py-4 md:px-12 md:py-5 rounded-full text-base md:text-lg font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(250,204,21,0.2)]"
          >
            Start now
          </Link>
        </motion.div>

        <div className="relative mt-12 md:mt-20 max-w-5xl mx-auto">
          {/* Main Centerpiece: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="relative z-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] ring-1 ring-white/20"
          >
            <Image
              src="/images/dashboard-hero.png"
              alt="WiseSpend Dashboard"
              width={1200}
              height={800}
              className="w-full h-auto opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
          </motion.div>

          {/* Floating Receipt Card */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [-8, -6, -8],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-10 -left-6 md:-top-12 md:-left-12 lg:-left-20 z-20 w-32 md:w-48 lg:w-72"
          >
            <div className="bg-[#1a1a1a]/80 backdrop-blur-lg p-2 md:p-3 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
              <Image
                src="/images/receipt-hero.png"
                alt="AI Receipt Analysis"
                width={300}
                height={400}
                className="rounded-[1rem] md:rounded-[1.5rem] w-full"
              />
              <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="mt-3 md:mt-4 bg-[#6b4c5c] p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/10 shadow-xl">
              <p className="text-[10px] md:text-xs font-black tracking-tight leading-tight">
                Quickly discover what's near
              </p>
              <button className="mt-1.5 md:mt-2 text-[8px] md:text-[10px] bg-white text-black px-2 md:px-3 py-1 md:py-1.5 rounded-full font-bold">
                Download the app
              </button>
            </div>
          </motion.div>

          {/* Floating Icons & Shapes */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -right-10 z-20 hidden md:block"
          >
            <svg
              width="180"
              height="180"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-yellow-400 rotate-12 opacity-80"
            >
              <path
                d="M100 0L112.986 64.9519H178.647L125.617 105.096L138.603 170.048L85.5728 129.904L32.5428 170.048L45.5287 105.096L-7.50152 64.9519H58.159L71.1449 0H100Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>

          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-8 md:-right-12 z-0 w-24 h-24 md:w-32 md:h-32 border border-white/10 rounded-full flex items-center justify-center border-dashed"
          >
            <div className="size-3 md:size-4 bg-white/20 rounded-full"></div>
          </motion.div>

          <div className="absolute top-[10%] -right-4 md:top-[15%] md:right-[5%] z-20 bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-full border border-white/20 shadow-xl">
            <CreditCard size={18} className="md:size-6 text-yellow-400" />
          </div>

          <div className="absolute bottom-[20%] -left-4 md:left-[5%] z-20 bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-full border border-white/20 shadow-xl">
            <Sparkles size={18} className="md:size-6 text-teal-400" />
          </div>
        </div>
      </section>
    </main>
  );
}
