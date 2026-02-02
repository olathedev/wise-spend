"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Target,
  BarChart3,
  ShieldCheck,
  Smartphone,
  BellRing,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-First Financial Coach",
    description:
      "Powered by Gemini 1.5 Pro, our agent understands the 'why' behind your spending, not just the 'what'.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Target,
    title: "Socratic Goal Impact",
    description:
      "Instead of raw data, our coach asks: 'Is this purchase worth delaying your house deposit by 2 weeks?'",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
  },
  {
    icon: BarChart3,
    title: "Vision-to-Vault Scanning",
    description:
      "Native multimodal processing extracts every line item and distinguishes necessity from luxury with 99% accuracy.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: ShieldCheck,
    title: "Emergency Simulator",
    description:
      "Run agentic 'What-if' scenarios to see how your habits would hold up against job loss or medical emergencies.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Smartphone,
    title: "Pattern Recognition",
    description:
      "Turn 'Financial Fog' into clarity by identifying behavioral patterns before they become unbreakable habits.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: BellRing,
    title: "Verifiable Intelligence",
    description:
      "Built with Opik observability to ensure supportive, firm, and hallucination-free financial guidance.",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
];

export function Features() {
  return (
    <section className="relative py-24 md:py-32 px-6 bg-[#111111]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-yellow-400 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-4"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-[1000] tracking-[-0.04em] uppercase italic italic"
          >
            Smarter <span className="text-white/50">Finance</span> Tools
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="h-full backdrop-blur-md bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] hover:bg-white/5 hover:border-white/20 transition-all duration-300">
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight mb-3 italic">
                  {feature.title}
                </h3>
                <p className="text-white/50 leading-relaxed font-medium text-sm">
                  {feature.description}
                </p>

                {/* Subtle Gradient Glow on Hover */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-400/5 rounded-full blur-[180px] -z-10"></div>
    </section>
  );
}
