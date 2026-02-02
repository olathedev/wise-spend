"use client";

import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white selection:bg-yellow-400 selection:text-black font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      {/* Glassmorphic Navbar */}
      <nav className="fixed top-0 w-full z-[60] px-4 py-6 md:px-6 md:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 px-4 py-3 md:px-8 md:py-4 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl overflow-hidden bg-yellow-400 p-0.5">
              <Image
                src="/logo.jpeg"
                alt="WiseSpend Logo"
                width={40}
                height={40}
                className="rounded-[0.5rem] md:rounded-[0.6rem]"
              />
            </div>
            <span className="text-lg md:text-2xl font-[900] tracking-tighter uppercase italic">
              WiseSpend
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {["Products", "Features", "Plans", "About"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm font-bold text-white/70 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/auth/signin"
              className="text-xs md:text-sm font-bold text-white hover:text-yellow-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-full text-[10px] md:text-sm font-black uppercase tracking-tight hover:bg-yellow-400 transition-all active:scale-95"
            >
              Start now
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection />
      <HowItWorks />
      <Features />
      <Footer />
    </div>
  );
}
