"use client";

import { motion } from "framer-motion";
import { Camera, LayoutGrid, Target, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Snap & Scan",
    description:
      "Simply take a photo of your receipt. Our AI deep-scans every line item with 99.9% accuracy.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: LayoutGrid,
    title: "Auto-Categorize",
    description:
      "Transactions are instantly grouped by category, merchant, and necessity without you lifting a finger.",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
  },
  {
    icon: Target,
    title: "Goal Impact",
    description:
      "See exactly how that morning coffee affects your house deposit or vacation fund in real-time.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-yellow-400 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-4"
          >
            The Experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-[1000] tracking-[-0.04em] uppercase italic italic"
          >
            How <span className="text-white/50">It</span> Works
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-10"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group relative"
            >
              <div className="h-full backdrop-blur-xl bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2.5rem] hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2 group shadow-2xl">
                <div
                  className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}
                >
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 italic">
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed font-medium">
                  {step.description}
                </p>

                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-sm font-black text-white/40 group-hover:text-yellow-400 transition-colors">
                  0{index + 1}
                </div>
              </div>

              {/* Arrow Icon for flow (Desktop Only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-20 opacity-20 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
