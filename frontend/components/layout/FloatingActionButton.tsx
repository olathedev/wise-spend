'use client';

import Link from 'next/link';

export default function FloatingActionButton() {
  return (
    <Link 
      href="/dashboard/ai-coach"
      className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-teal-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce-slow"
    >
      <span className="material-icons-round text-3xl">bubble_chart</span>
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500 border-2 border-white dark:border-slate-900"></span>
      </span>
    </Link>
  );
}
