"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "How it works", href: "#how-it-works" },
      { name: "Features", href: "#features" },
      { name: "Testimonials", href: "#" },
      { name: "Pricing", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "#" },
      { name: "Security", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 pb-12 px-6 overflow-hidden border-t border-white/5 bg-white/[0.02] backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          {/* Logo and Tagline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-yellow-400 p-0.5">
                <Image
                  src="/logo.jpeg"
                  alt="WiseSpend Logo"
                  width={40}
                  height={40}
                  className="rounded-[0.6rem]"
                />
              </div>
              <span className="text-2xl font-[900] tracking-tighter uppercase italic">
                WiseSpend
              </span>
            </div>
            <p className="text-white/50 max-w-sm leading-relaxed font-medium">
              Transforming "financial fog" into actionable resilience with
              agentic, AI-first financial coaching.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-white/40 italic">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors flex items-center gap-1 group w-fit"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-sm font-medium">
            © {new Date().getFullYear()} WiseSpend. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <p className="text-[10px] uppercase font-black tracking-widest text-white/20">
              Powered by Google Gemini 1.5 Pro
            </p>
            <p className="text-[10px] uppercase font-black tracking-widest text-white/20">
              Best Use of Opik
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-[120px] -z-10 translate-y-1/2 translate-x-1/2"></div>
    </footer>
  );
}
